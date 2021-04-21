let observers: Function[] = [];
export const subscribe = (f: Function) => {
  observers.push(f);
};

export const unsubscribe = (f: Function) => {
  observers = observers.filter((subscriber) => subscriber !== f);
};

export const notify = (data: any) => {
  observers.forEach((observer: Function) => observer(data));
};
