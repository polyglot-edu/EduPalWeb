import { PolyglotEdge, PolyglotNode } from '.';
import { EdgePropertiesProps } from '../../components/Properties/Edges/EdgeProperties';
import { NodePropertiesProps } from '../../components/Properties/Nodes/NodeProperties';
import { ReactFlowEdgeProps } from '../../components/ReactFlowEdge/ReactFlowEdge';
import { ReactFlowNodeProps } from '../../components/ReactFlowNode/ReactFlowNode';

// https://github.com/Microsoft/TypeScript/pull/18654
// https://stackoverflow.com/questions/52667959/what-is-the-purpose-of-bivariancehack-in-typescript-types
type PropertiesComponent<T> = {
  bivarianceHack(props: T): JSX.Element;
}['bivarianceHack'];
type ReactFlowComponent<T> = {
  bivarianceHack(props: T): JSX.Element;
}['bivarianceHack'];

type ElementToPropertyComponentMapping<T> = {
  [elementType: string]: PropertiesComponent<T>;
};
type ElementToReactFlowComponentMapping<T> = {
  [elementType: string]: ReactFlowComponent<T>;
};
type ElementToNameMapping = { [elementType: string]: string };
type ElementToIconMapping = { [elementType: string]: string | undefined };
type ElementToPlatformMapping = { [elementType: string]: string | undefined };
type ElementToGroupMapping = { [elementType: string]: string | undefined };
type ElementToDefaultDataMapping<T> = { [elementType: string]: T };
type ElementToTransformDataMapping<T> = {
  [elementType: string]: (data: T) => T;
};

type TypeWithData = { data: unknown; type: string };
type MappingType<T, U, K extends TypeWithData, V extends TypeWithData> = {
  elementType: string;
  name: string;
  icon?: string;
  group?: string;
  platform?: string;
  propertiesComponent: PropertiesComponent<T>;
  elementComponent: ReactFlowComponent<U>;
  defaultData: K['data'] & V['data'];
  transformData?: (data: K) => K;
};

class PolyglotComponentMapping<T, U, K extends TypeWithData> {
  private _propertiesMapping: ElementToPropertyComponentMapping<T> = {};
  private _elementMapping: ElementToReactFlowComponentMapping<U> = {};
  private _nameMapping: ElementToNameMapping = {};
  private _iconMapping: ElementToIconMapping = {};
  private _defaulPlatformMapping: ElementToPlatformMapping = {};
  private _groupMapping: ElementToGroupMapping = {};
  private _defaultDataMapping: ElementToDefaultDataMapping<K['data']> = {};
  private _transformMapping: ElementToTransformDataMapping<K> = {};

  // TODO: stricter type checking on the elementComponent
  // undefined should be allowed if and only if the registered element uses an already built-in ReactFlow type
  public registerMapping<V extends TypeWithData>({
    elementType,
    name,
    icon,
    group,
    platform,
    propertiesComponent,
    elementComponent,
    defaultData,
    transformData = (data) => data,
  }: MappingType<T, U, K, V>) {
    if (elementType in this._propertiesMapping) {
      throw new Error(`Element type ${elementType} is already registered`);
    }

    console.log('elementType: ' + elementType + ' registered');
    this._propertiesMapping[elementType] = propertiesComponent;
    this._elementMapping[elementType] = elementComponent;
    this._nameMapping[elementType] = name;
    this._iconMapping[elementType] = icon;
    this._defaulPlatformMapping[elementType] = platform;
    this._groupMapping[elementType] = group;
    this._defaultDataMapping[elementType] = defaultData;
    this._transformMapping[elementType] = transformData;
  }

  get propertiesMapping(): Readonly<ElementToPropertyComponentMapping<T>> {
    return this._propertiesMapping;
  }

  get componentMapping(): Readonly<ElementToReactFlowComponentMapping<U>> {
    return this._elementMapping;
  }

  get nameMapping(): Readonly<ElementToNameMapping> {
    return this._nameMapping;
  }

  get iconMapping(): Readonly<ElementToIconMapping> {
    return this._iconMapping;
  }

  get defaultPlatformMapping(): Readonly<ElementToPlatformMapping> {
    return this._defaulPlatformMapping;
  }

  get groupMapping(): Readonly<ElementToGroupMapping> {
    return this._groupMapping;
  }

  get defaultDataMapping(): Readonly<ElementToDefaultDataMapping<K['data']>> {
    return this._defaultDataMapping;
  }

  get transformMapping(): Readonly<ElementToTransformDataMapping<K>> {
    return this._transformMapping;
  }

  applyTransformFunction(element: K): K {
    const transformFunction = this._transformMapping[element.type];
    return transformFunction ? transformFunction(element) : element;
  }

  getElementPropertiesComponent(
    elementType: string | undefined
  ): PropertiesComponent<T> {
    return elementType !== undefined
      ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this._propertiesMapping[elementType] ?? ((_) => <></>)
      : // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_) => <></>;
  }
}

const polyglotNodeComponentMapping = new PolyglotComponentMapping<
  NodePropertiesProps,
  ReactFlowNodeProps,
  PolyglotNode
>();
export { polyglotEdgeComponentMapping, polyglotNodeComponentMapping };

const polyglotEdgeComponentMapping = new PolyglotComponentMapping<
  EdgePropertiesProps,
  ReactFlowEdgeProps,
  PolyglotEdge
>();
