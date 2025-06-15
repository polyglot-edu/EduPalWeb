import { BaseButton, IDropdownOption } from '@fluentui/react';
import * as t from 'io-ts';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { PartialDeep } from 'type-fest';

export type TextInputEvent =
  | React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export type DropdownEvent = React.FormEvent<HTMLDivElement>;

export type RatingEvent = React.FormEvent<HTMLElement>;

export type ButtonEvent = React.MouseEvent<
  | HTMLAnchorElement
  | HTMLButtonElement
  | HTMLDivElement
  | BaseButton
  | HTMLSpanElement,
  MouseEvent
>;

export type CheckboxEvent = React.FormEvent<HTMLElement | HTMLInputElement>;

// TODO: maybe change this to
/*
    type EventActionWithParameter<T, K> = ((v: K, e?: T) => void)
    type EventAction<T> = ((e: T) => void);

*/
type EventAction<K> = (v: K) => void;
type EventHandler<T, K> = (
  action: EventAction<K>
) => (e: T, ...args: any[]) => void;

export const textInputEventAdapter: EventHandler<TextInputEvent, string> = (
  action
) => {
  return (e: TextInputEvent) => action(e.currentTarget.value);
};

export const dropdownEventAdapter: EventHandler<DropdownEvent, string> = (
  action
) => {
  return (e: DropdownEvent, option: IDropdownOption) =>
    action(option.key as string);
};

export const ratingEventAdapter: EventHandler<RatingEvent, number> = (
  action
) => {
  return (e: RatingEvent, rating: number) => action(rating);
};

export const buttonEventAdapter: EventHandler<
  ButtonEvent,
  ButtonEvent | undefined
> = (action) => {
  return (e: ButtonEvent) => action(e);
};

export const checkboxEventAdapter: EventHandler<
  CheckboxEvent | undefined,
  boolean
> = (action) => {
  return (e: CheckboxEvent | undefined, checked: boolean) => action(checked);
};

export const monacoEventAdapter: EventHandler<
  monaco.editor.IModelContentChangedEvent,
  string
> = (action) => {
  return (e: monaco.editor.IModelContentChangedEvent, value: string) =>
    action(value);
};

// manually curried version of
// function eventHandlerFactory<T, K, V>(
//     applyUpdate: (value: Partial<T>) => void,
//     eventHandler: EventHandler<K, V>,
//     updateValue: (value: V) => Partial<T>,
//     logging = false,
//     loggingLine = ""
// )
export function eventHandlerFactory<T>(
  applyUpdate: (value: PartialDeep<T>) => void
) {
  return <K, V>(eventHandler: EventHandler<K, V>) => {
    return (
      updateValue: (value: V) => PartialDeep<T>,
      logging = false,
      loggingLine = ''
    ) => {
      return eventHandler((value) => {
        const newValue = updateValue(value);
        if (logging) {
          console.log('Input handled: ' + loggingLine);
          console.table(newValue);
        }
        applyUpdate(newValue);
      });
    };
  };
}

function _actual_update<T, K extends Path<T>>(
  fieldToUpdate: K,
  value: PathValue<T, K>
): PartialDeep<T> {
  if (typeof fieldToUpdate === 'string') {
    return fieldToUpdate
      .split('.')
      .reverse()
      .reduce((obj, curr) => ({ [curr]: obj }), value as any);
  }
  return { [fieldToUpdate]: value } as PartialDeep<T>;
}

// TODO: test this function
export function updater<T>() {
  return function <K extends Path<T>>(fieldToUpdate: K) {
    return function <W extends PathValue<T, K>>(value: W): PartialDeep<T> {
      return _actual_update(fieldToUpdate, value);
    };
  };
}

// TODO: test this function
export function updaterWithTypeGuard<T>() {
  return function <K extends Path<T>>(
    fieldToUpdate: K,
    type: t.Type<PathValue<T, K>>
  ) {
    return function (value: unknown): PartialDeep<T> {
      if (type.is(value)) {
        return _actual_update(fieldToUpdate, value);
      } else {
        console.error(
          'Value received: "' +
            value +
            '". Type ' +
            typeof value +
            ' and ' +
            type.name +
            ' are incompatible'
        );
        return {} as PartialDeep<T>;
      }
    };
  };
}
