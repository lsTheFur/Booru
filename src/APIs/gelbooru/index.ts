import axios from 'axios';
import BaseAPI from '../baseAPI';
import { Post } from '../ReturnValues';
interface APIPost {
	// ID
	id: number;
	// MD5
	md5: string;
	// Image Name
	image: string;
	// Image Data
	file_url: string;
	width: number;
	height: number;
	// Tags
	tags: string;
	// Preview Data
	preview_url: string;
	preview_height: number;
	preview_width: number;
	// Source
	source?: string;
	// Score
	score?: number;
	// Rating
	rating?: 'safe' | 'questionable' | 'explicit';
}
class ReturnedPost implements Post {
	// ID
	id: number;
	// file_url
	URL: string;
	// rating
	Rating: 'explicit' | 'questionable' | 'safe';
	// score
	Score: number;
	// source
	Source?: string;
	// image
	fileName: string;
	// tags
	Tags: string;
	// raw API return
	Raw = {};
	///// METHODS
	async Download() {
		return (
			await axios({
				url: this.URL,
				responseType: 'arraybuffer',
			})
		).data;
	}
	static fromAPIPost(post: APIPost) {
		const rtpost = new ReturnedPost();
		rtpost.id = post.id;
		rtpost.Score = post.score;
		rtpost.Rating = post.rating;
		rtpost.Source = post.source;
		rtpost.URL = post.file_url;
		rtpost.fileName = post.image;
		rtpost.Tags = post.tags;
		rtpost.Raw = post;
		return rtpost;
	}
}
export default class GelbooruAPI extends BaseAPI {
	constructor(BaseURL: string, API?: string, USER?: string) {
		super(BaseURL, API, USER);
		this.BaseURL = BaseURL;
		if (API && USER) {
			this.GlobalApiUrlArgs += `&api_key=${API}&user_id=${USER}`;
		}
	}
	GlobalApiUrlArgs: string = '';
	BaseURL: string;
	_getURL(args: string) {
		return this.BaseURL + '?json=1&' + args + this.GlobalApiUrlArgs;
	}
	async _API_Posts(tags: string, page: number = 0) {
		const a = (
			await axios({
				url: this._getURL(
					'page=dapi&s=post&q=index&limit=100&pid=' + page + '&tags=' + tags
				),
				responseType: 'json',
			})
		).data;
		return a;
	}
	async _Posts(tags: string, page: number = 0) {
		const RawPostData: APIPost[] = (await this._API_Posts(tags, page)).post;
		if (!RawPostData) return [];
		const Posts: ReturnedPost[] = [];
		RawPostData.forEach(v => Posts.push(ReturnedPost.fromAPIPost(v)));
		return Posts;
	}
	async Posts(tags: string = '', pages: number = 2) {
		const Posts: ReturnedPost[] = [];
		let page = 0;
		while (page < pages) {
			const d = await this._Posts(tags, page);
			if (d.length === 0) break;
			d.forEach(v => Posts.push(v));
			page++;
		}
		return Posts;
	}
	async _API_Post(id: number) {
		return (
			await axios({
				url: this._getURL('page=dapi&s=post&q=index&limit=1&id=' + id),
				responseType: 'json',
			})
		).data;
	}
	async Post(id: number) {
		const post: APIPost[] = (await this._API_Post(id)).post;
		return ReturnedPost.fromAPIPost(post[0]);
	}
}
