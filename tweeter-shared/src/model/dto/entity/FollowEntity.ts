export class FollowEntity {
	follower_handle: string;
	follower_firstName: string;
	follower_lastName: string;
	follower_imageUrl: string;
	followee_handle: string;
	followee_firstName: string;
	followee_lastName: string;
	followee_imageUrl: string;
	follower_count: number;
	followee_count: number;

	constructor(
		follower_handle: string,
		follower_firstName: string,
		follower_lastName: string,
		follower_imageUrl: string,
		followee_handle: string,
		followee_firstName: string,
		followee_lastName: string,
		followee_imageUrl: string,
		follower_count: number,
		followee_count: number,
	) {
	  this.follower_handle = follower_handle;
	  this.follower_firstName = follower_firstName;
	  this.follower_lastName = follower_lastName;
	  this.follower_imageUrl = follower_imageUrl;
	  this.followee_handle = followee_handle;
	  this.followee_firstName = followee_firstName;
	  this.followee_lastName = followee_lastName;
	  this.followee_imageUrl = followee_imageUrl;
	  this.followee_count = followee_count;
	  this.follower_count = follower_count;
	}

	toString(): string {
	  return (
		"FollowerEntity{" +
		"followee_handle='" +
		this.followee_handle +
		"'" +
		", follower_firstName='" +
		this.follower_firstName +
		"'" +
		", follower_lastName='" +
		this.follower_lastName +
		"'" +
		", follower_imageUrl='" +
		this.follower_imageUrl +
		"'" +
		", followee_handle=" +
		this.followee_handle +
		", followee_firstName='" +
		this.followee_firstName +
		"'" +
		", followee_lastName='" +
		this.followee_lastName +
		"'" +
		", followee_imageUrl='" +
		this.followee_imageUrl +
		"'"
		+
		", follower_count='" +
		this.follower_count +
		"'"
		+
		", followee_count='" +
		this.followee_count +
		"'"
	  );
	}
  }
