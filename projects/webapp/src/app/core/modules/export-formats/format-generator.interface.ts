export interface CSVGeneratorOptions<T> {
    objects: Array<T>;
    columnsKeys: Array<string>;
    columnsNames: Array<string>;
    separator?: ';' | ',';
}

export interface FormatGenerator {

    generate: <T>(options: CSVGeneratorOptions<T>) => string;

}