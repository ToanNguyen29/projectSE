class APIFeature {
  constructor(query, queryString, user) {
    this.query = query;
    this.queryString = queryString;
    this.user = user;
  }

  filtering() {
    let queryObj = { ...this.queryString };
    const excludeFields = [
      'sort',
      'fields',
      'page',
      'limit',
      'searchUser',
      'searchPost'
    ];
    excludeFields.forEach((el) => delete queryObj[el]);

    this.query = this.query.find(queryObj);
    return this;
  }

  searching() {
    if (this.queryString.searchUser) {
      const keyword = this.queryString.searchUser
        ? {
            $or: [
              {
                firstName: {
                  $regex: this.queryString.searchUser,
                  $options: 'i'
                }
              },
              {
                lastName: { $regex: this.queryString.searchUser, $options: 'i' }
              },
              { email: { $regex: this.queryString.searchUser, $options: 'i' } }
            ]
          }
        : {};

      console.log(this.user._id);

      this.query.find(keyword).find({ _id: { $ne: this.user._id } });
    }

    if (this.queryString.searchPost) {
      const keyword = this.queryString.searchPost
        ? {
            $or: [
              {
                content: { $regex: this.queryString.searchPost, $options: 'i' }
              }
            ]
          }
        : {};
      this.query.find(keyword).find({ postedBy: { $ne: this.user._id } });
    }
    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.replace(/,/g, ' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limiting() {
    if (this.queryString.fields) {
      const fieldBy = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fieldBy);
    } else {
      this.query = this.query.select('-__v'); // -__v là khi migration thì nó tự tạo nên khi hiện thông tin ra thì không cần hiện nó nên ta dùng - để loại bỏ
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeature;
