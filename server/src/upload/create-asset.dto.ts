export class CreateAssetDto {
  id?: number;
  title: string;
  comment: string;
  filename: string;
  path: string;
  settings: JSON;
}
