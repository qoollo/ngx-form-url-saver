import { ArticleType } from "../enums/article-type";
import { Article } from "./article";

export class ArticleBuilder {
  constructor(
    private _id ?: number,
    private _authorId ?: number,
    private _title ?:string,
    private _description ?:string,
    private _type ?: ArticleType
  ){}

  public withId(id: number) {
    this._id = id;
    return this;
  }

  public withAuthorId(id: number) {
    this._authorId = id;
    return this;
  }

  public withTitle(title: string) {
    this._title = title;
    return this;
  }

  public withDescription(description: string) {
    this._description = description;
    return this;
  }

  public withType(type: ArticleType) {
    this._type = type;
    return this;
  }

  public build () {
    return {
      id: this._id,
      authorId: this._authorId,
      title: this._title,
      description: this._description,
      type: this._type
    } as Article;
  };
}
