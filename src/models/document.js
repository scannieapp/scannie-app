import uuidv4 from "uuid/v4";
import moment from "moment";

class Document {
  setFile(file) {
    this.filename = file.name;
    this.path = `documents/${file.name}`;
    this.compressedPath = `compressed_thumbnails/${file.name}`;
    this.uuid = uuidv4();
    this.uploadedAt = Date.now();
  }

  fromObject(object) {
    this.filename = object.name;
    this.path = object.path;
    this.compressedPath = object.compressedPath;
    this.uuid = object.uuid;
    this.uploadedAt = object.uploadedAt;
  }

  bestMoment() {
    if (this.uploadedAt) {
      return moment(this.uploadedAt).startOf("day");
    }
    return moment().startOf("day");
  }

  bestDate() {
    if (this.uploadedAt) {
      return moment(this.uploadedAt)
        .startOf("day")
        .valueOf();
    }
    return 0;
  }
}

export default Document;
