export class DataPage<T> {
	values: T[]; // page of values returned by the database
	hasMorePages: boolean; // Indicates whether there are more pages of data available to be retrieved

	constructor(values: T[], hasMorePages: boolean) {
	  this.values = values;
	  this.hasMorePages = hasMorePages;
	}

	returnLast() {
		return this.values[-1];
	}
  }