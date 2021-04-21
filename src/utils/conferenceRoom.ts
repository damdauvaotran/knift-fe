import { Socket } from "socket.io-client";
import * as mediaSoupClient from "mediasoup-client";
import { _EVENTS, mediaType } from "../constants";
import { consumerObs, closeConsumerObs } from "../ observer/";

export class ConferenceRoom {
  public name: string;
  public roomId: string;
  public socket: Socket;
  public _isOpen: boolean = false;
  public device?: mediaSoupClient.types.Device;
  public producerTransport?: mediaSoupClient.types.Transport;
  public consumerTransport?: mediaSoupClient.types.Transport;
  public consumers: Map<string, any> = new Map<string, any>();
  public producers: Map<string, any> = new Map<string, any>();
  public eventListeners: Map<string, Function[]> = new Map<
    string,
    Function[]
  >();
  public producerLabel: Map<string, any> = new Map<string, any>();

  constructor(name: string, roomId: string, socket: Socket) {
    this.name = name;
    this.roomId = roomId;
    this.socket = socket;

    this.eventListeners = new Map<string, Function[]>();
    Object.keys(_EVENTS).forEach((evt: string) => {
      this.eventListeners.set(evt, []);
    });
  }

  async init() {
    await this.createRoom(this.roomId);
    await this.join(this.name, this.roomId);
    this.initSockets();
    this._isOpen = true;
  }

  async createRoom(roomId: string) {
    await this.socketRequest("createRoom", {
      roomId,
    }).catch((err: Error) => {
      console.log(err);
    });
  }

  async join(name: string, roomId: string) {
    console.log(`join room ${roomId}`);
    const e = await this.socketRequest("join", {
      name,
      roomId,
    });

    console.log(e);
    const data = await this.socketRequest("getRouterRtpCapabilities");
    let device = await this.loadDevice(
      data as mediaSoupClient.types.RtpCapabilities
    );
    this.device = device;
    console.log("device", device);
    await this.initTransports(device);
    this.socket.emit("getProducers");
  }

  async loadDevice(
    routerRtpCapabilities: mediaSoupClient.types.RtpCapabilities
  ) {
    let device;
    try {
      device = new mediaSoupClient.Device();
    } catch (error) {
      if (error.name === "UnsupportedError") {
        console.error("browser not supported");
      }
      console.error(error);
    }
    await device?.load({
      routerRtpCapabilities,
    });
    return device;
  }

  async initTransports(device?: mediaSoupClient.types.Device) {
    if (!device) {
      console.error("Device not available");
      return;
    }
    // init producerTransport
    {
      const data = await this.socketRequest("createWebRtcTransport", {
        forceTcp: false,
        rtpCapabilities: device.rtpCapabilities,
      });
      console.log("createWebRtcTransport", data);
      if (data.error) {
        console.error(data.error);
        return;
      }

      this.producerTransport = device.createSendTransport(data);
      console.log("producerTransport", this.producerTransport);
      this.producerTransport.on(
        "connect",
        async ({ dtlsParameters }, callback, errback) => {
          this.socketRequest("connectTransport", {
            dtlsParameters,
            transportId: data.id,
          })
            .then(callback)
            .catch(errback);
        }
      );

      this.producerTransport.on(
        "produce",
        async (
          { kind, rtpParameters },
          callback: Function,
          errback: Function
        ) => {
          try {
            const { producerId } = await this.socketRequest("produce", {
              producerTransportId: this.producerTransport?.id,
              kind,
              rtpParameters,
            });
            callback({
              id: producerId,
            });
          } catch (err) {
            errback(err);
          }
        }
      );

      this.producerTransport.on("connectionstatechange", (state: string) => {
        switch (state) {
          case "connecting":
            break;

          case "connected":
            //localVideo.srcObject = stream
            break;

          case "failed":
            this.producerTransport?.close();
            break;

          default:
            break;
        }
      });
    }

    // init consumerTransport
    {
      const data = await this.socketRequest("createWebRtcTransport", {
        forceTcp: false,
      });
      if (data.error) {
        console.error(data.error);
        return;
      }

      // only one needed
      this.consumerTransport = device.createRecvTransport(data);
      this.consumerTransport.on(
        "connect",
        ({ dtlsParameters }, callback: Function, errback: Function) => {
          this.socketRequest("connectTransport", {
            transportId: this.consumerTransport?.id,
            dtlsParameters,
          })
            .then(callback)
            .catch(errback);
        }
      );

      this.consumerTransport.on(
        "connectionstatechange",
        async (state: string) => {
          switch (state) {
            case "connecting":
              break;

            case "connected":
              //remoteVideo.srcObject = await stream;
              //await socket.request('resume');
              break;

            case "failed":
              this.consumerTransport?.close();
              break;

            default:
              break;
          }
        }
      );
    }
  }

  initSockets() {
    this.socket.on("consumerClosed", ({ consumerId }) => {
      console.log("closing consumer:", consumerId);
      this.removeConsumer(consumerId);
    });

    /**
     * data: [ {
     *  producer_id:
     *  producer_socket_id:
     * }]
     */
    this.socket.on("newProducers", async (data) => {
      console.log("new producers", data);
      for (const { producerId } of data) {
        await this.consume(producerId);
      }
    });

    this.socket.on("disconnect", () => {
      this.exit(true);
    });
  }

  removeConsumer(consumerId: string) {
    // let elem = document.getElementById(consumer_id);
    // elem.srcObject.getTracks().forEach(function (track) {
    //   track.stop();
    // });
    // elem.parentNode.removeChild(elem);
    // Todo: remove consume HTML element
    closeConsumerObs.notify({ consumerId });
    this.consumers.delete(consumerId);
  }

  async produce(type: string, stream: MediaStream) {
    let audio = false;
    let screen = false;

    try {
      const track = audio
        ? stream.getAudioTracks()[0]
        : stream.getVideoTracks()[0];
      const params = {
        track,
        encodings: undefined,
        codecOptions: undefined,
      };
      if (!audio && !screen) {
        // @ts-ignore
        params.encodings = [
          {
            rid: "r0",
            maxBitrate: 100000,
            //scaleResolutionDownBy: 10.0,
            scalabilityMode: "S1T3",
          },
          {
            rid: "r1",
            maxBitrate: 300000,
            scalabilityMode: "S1T3",
          },
          {
            rid: "r2",
            maxBitrate: 900000,
            scalabilityMode: "S1T3",
          },
        ];
        // @ts-ignore
        params.codecOptions = {
          videoGoogleStartBitrate: 1000,
        };
      }
      // @ts-ignore
      const producer = await this.producerTransport.produce(params);

      console.log("producer", producer, params);

      if (producer) {
        this.producers.set(producer.id, producer);
      }

      // let elem;
      // if (!audio) {
      //   elem = document.createElement("video");
      //   elem.srcObject = stream;
      //   elem.id = producer.id;
      //   elem.playsinline = false;
      //   elem.autoplay = true;
      //   elem.className = "vid";
      //   this.localMediaEl.appendChild(elem);
      // }

      producer?.on("trackended", () => {
        this.closeProducer(type);
      });

      producer?.on("transportclose", () => {
        console.log("producer transport close");
        if (!audio) {
          stream.getTracks().forEach(function (track) {
            track.stop();
          });
        }
        this.producers.delete(producer.id);
      });

      producer?.on("close", () => {
        console.log("closing producer");
        if (!audio) {
          stream.getTracks().forEach(function (track) {
            track.stop();
          });
        }
        this.producers.delete(producer.id);
      });

      this.producerLabel.set(type, producer?.id);

      switch (type) {
        case mediaType.audio:
          this.event(_EVENTS.startAudio);
          break;
        case mediaType.video:
          this.event(_EVENTS.startVideo);
          break;
        case mediaType.screen:
          this.event(_EVENTS.startScreen);
          break;
        default:
          return;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async consume(producerId: string) {
    //let info = await roomInfo()

    const consumerStreamInfo = await this.getConsumeStream(producerId);

    const { consumer, stream, kind } = consumerStreamInfo;

    this.consumers.set(consumer.id, consumer);

    consumer.on("trackended", () => {
      this.removeConsumer(consumer.id);
    });
    consumer.on("transportclose", () => {
      this.removeConsumer(consumer.id);
    });

    consumerObs.notify({
      consumerStream: stream,
      consumerId: consumer.id,
    });
    let elem;
    const remoteVideoEl = document.getElementById("remote");
    if (kind === "video") {
      // elem = document.createElement("video");
      // elem.srcObject = stream;
      // elem.id = consumer.id;
      // elem.playsInline = false;
      // elem.autoplay = true;
      // elem.className = "vid";
      // // @ts-ignore
      // remoteVideoEl.appendChild(elem);
      // Todo: assign video to remote element
    } else {
      // elem = document.createElement("audio");
      // elem.srcObject = stream;
      // elem.id = consumer.id;
      // elem.playsinline = false;
      // elem.autoplay = true;
      // this.remoteAudioEl.appendChild(elem);
      // Todo: assign audio to remote element
    }
  }

  async getConsumeStream(
    producerId: string
  ): Promise<{ consumer: any; stream: any; kind: any }> {
    const rtpCapabilities = this.device?.rtpCapabilities;
    const data = await this.socketRequest("consume", {
      rtpCapabilities,
      // @ts-ignore
      consumerTransportId: this.consumerTransport.id,
      producerId,
    });
    const { id, kind, rtpParameters } = data;

    const consumer = await this.consumerTransport?.consume({
      id,
      producerId,
      kind,
      rtpParameters,
    });
    const stream = new MediaStream();
    // @ts-ignore
    stream.addTrack(consumer.track);
    return {
      consumer,
      stream,
      kind,
    };
  }

  closeProducer(type: string) {
    if (!this.producerLabel.has(type)) {
      console.log("there is no producer for this type " + type);
      return;
    }
    let producerId = this.producerLabel.get(type);
    console.log("producerId", producerId);
    this.socket.emit("producerClosed", {
      producerId,
    });
    this.producers.get(producerId).close();
    this.producers.delete(producerId);
    this.producerLabel.delete(type);

    if (type !== mediaType.audio) {
      // let elem = document.getElementById(producerId);
      // elem.srcObject.getTracks().forEach(function (track) {
      //   track.stop();
      // });
      // elem.parentNode.removeChild(elem);
      // Todo: remove producer
    }

    switch (type) {
      case mediaType.audio:
        this.event(_EVENTS.stopAudio);
        break;
      case mediaType.video:
        this.event(_EVENTS.stopVideo);
        break;
      case mediaType.screen:
        this.event(_EVENTS.stopScreen);
        break;
      default:
        return;
    }
  }

  exit(offline = false) {
    const clean = () => {
      this._isOpen = false;
      this.consumerTransport?.close();
      this.producerTransport?.close();
      this.socket.off("disconnect");
      this.socket.off("newProducers");
      this.socket.off("consumerClosed");
    };

    if (!offline) {
      this.socketRequest("exitRoom")
        .then((e: any) => console.log(e))
        .catch((e: Error) => console.warn(e))
        .finally(function () {
          clean();
        });
    } else {
      clean();
    }

    this.event(_EVENTS.exitRoom);
  }

  event(evt: string) {
    if (this.eventListeners.has(evt)) {
      this.eventListeners.get(evt)?.forEach((callback: Function) => callback());
    }
  }

  on(evt: string, callback: Function) {
    this.eventListeners.get(evt)?.push(callback);
  }

  socketRequest = (type: string, data = {}): any => {
    return new Promise((resolve, reject) => {
      this.socket.emit(type, data, (data: any) => {
        if (data?.error) {
          reject(data.error);
        } else {
          resolve(data);
        }
      });
    });
  };
}
