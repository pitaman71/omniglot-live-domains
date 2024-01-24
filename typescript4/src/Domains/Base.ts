export interface Parseable<BodyT = undefined> {
    text?: string;
    error?: any;
    parsed?: BodyT
}
