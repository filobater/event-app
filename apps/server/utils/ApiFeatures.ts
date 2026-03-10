export class ApiFeatures {
  query: any;
  requestQuery: any;

  constructor(query: any, requestQuery: any) {
    this.query = query;
    this.requestQuery = requestQuery;
  }

  search() {
    if (this.requestQuery.search) {
      this.query = this.query.find({
        $text: [{ $search: this.requestQuery.search }],
      });
    }
    return this;
  }

  sort() {
    if (this.requestQuery.sort) {
      const sortBy = this.requestQuery.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginate() {
    const page = Number(this.requestQuery.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
