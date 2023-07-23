export interface Species {
  species_name: string;
  abbreviation: string;
  total_genes: number;
  total_length: number;
  num_chr: number;
  institution: string;
  reference: string;
  rel_date: Date;
  mod_date: Date;
  update: Date;
  gtps: string;
  refseq: string;
  genbank: string;
  source: string;
}
