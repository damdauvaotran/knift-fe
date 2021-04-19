let observers: Function[] = [];
export const subscribe = (f: Function) => {
  observers.push(f);
};

// bỏ xã ra đi
export const unsubscribe = (f: Function) => {
  observers = observers.filter((subscriber) => subscriber !== f);
};

// lan tin cho toàn xã
export const notify = (data: any) => {
  observers.forEach((observer: Function) => observer(data));
};
