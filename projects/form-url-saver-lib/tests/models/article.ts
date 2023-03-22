import { ArticleType } from "../enums/article-type";

export interface Article {
  id: number | undefined;
  authorId: number | undefined;
  title: string | undefined;
  description: string | undefined;
  type: ArticleType | undefined;
}
