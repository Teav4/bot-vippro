import { LogLevels } from 'npmlog';
import { Cookie } from 'tough-cookie';
import Jar from './jar';
import mqtt from 'mqtt';
import stream from 'stream';
import FormData from 'form-data';
import { UserID } from './types/users';
import { Response } from 'got';
import { ThreadID } from './types/threads';

export type PrimitiveObject = Record<string, string | number | boolean | null | undefined>;

export interface LoginCredentials {
	email?: string;
	password?: string;
	appState?: AppState;
}

export interface ApiOptions {
	/** The desired logging level as determined by npmlog */
	logLevel?: LogLevels;
	/** Whether the api will receive messages from its own account. Default `false` */
	selfListen?: boolean;
	/** Will make `api.listen` also handle events. Default `false` */
	listenEvents?: boolean;
	/**
	 * Makes api.listen only receive messages through the page specified by that ID.
	 * Also makes `sendMessage` and `sendSticker` send from the page.
	 * Default empty
	 * */
	pageID?: string;
	/** Will make `api.listen` also return presence. Default `false` */
	updatePresence?: boolean;
	/** Will automatically approve of any recent logins and continue with the login process. Default `false` */
	forceLogin?: boolean;
	/** The desired simulated User Agent.
	 * Default `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/600.3.18 (KHTML, like Gecko) Version/8.0.3 Safari/600.3.18`
	 */
	userAgent?: string;
	/** Will automatically mark new messages as delivered. Default `true`*/
	autoMarkDelivery?: boolean;
	/** Will automatically mark new messages as read/seen. Default `false */
	autoMarkRead?: boolean;
	logRecordSize?: number;
}

/** Api context data */
export interface ApiCtx {
	userID: string;
	jar: Jar;
	clientID: string;
	globalOptions: ApiOptions;
	loggedIn: boolean;
	access_token: string;
	clientMutationId: number;
	mqttClient?: mqtt.MqttClient;
	lastSeqId: number;
	syncToken: any;
	fb_dtsg?: string;
	jazoest?: string;
	ttstamp?: any;
}

/** Default functions */
export interface Dfs {
	get: (url: string, jar: Jar, qs?: PrimitiveObject) => Promise<Response<string>>;
	post: (url: string, jar: Jar, form: Record<string, unknown>) => Promise<Response<string>>;
	postFormData: (
		url: string,
		jar: Jar,
		form: Record<string, unknown>,
		qs: PrimitiveObject
	) => Promise<Response<string>>;
	postFormData2: (url: string, jar: Jar, formData: FormData, qs: PrimitiveObject) => Promise<Response<string>>;
}

export interface RequestForm {
	client: string;
	[index: string]: any;
}

/** Message can only be a regular message (`body` field set) and optionally one of a `sticker`, `attachment` or `url` */
export interface OutgoingMessage {
	/** a plain-text content of the outgoing message */
	body?: string;
	/** Readable stream(s) to be sent as attachments. Can be any file, image, voiceclip... */
	attachment?: stream.Readable | stream.Readable[];
	/** message ID to which this new message would respond */
	replyToMessage?: MessageID;
	/** ID of the desired sticker */
	sticker?: number;
	// some useless properties which shouldn't be in npm package
	// url?: string;
	// emoji?: string;
	// emojiSize?: 'small' | 'medium' | 'large';
	/** Additional information when sending a message with user mentions.
	 * This property contains sorted "name & id" pairs. */
	mentions?: OutgoingMessageUserMention[];
}

export interface OutgoingMessageUserMention {
	/** text which will be referenced to mentioned user (usually starting with the @ (at) sign) */
	name: string;
	/** ID of the user being mentioned */
	id: UserID;
}
export enum OutgoingMessageSendType {
	PlainText = 1,
	Sticker = 2,
	Attachment = 3,
	// something = 4,
	ForwardMessage = 5
}

export type MessageID = string;

export interface MqttQueue {
	sync_api_version: number;
	max_deltas_able_to_process: number;
	delta_batch_size: number;
	encoding: string;
	entity_fbid: string;
	device_params?: null;
	initial_titan_sequence_id?: number;
	sync_token?: string;
	last_seq_id?: number;
}

/** Array of cookies representing the login state of a single Api instance.
 * This can be stored and used for later Api initialisation. */
export type AppState = Cookie[];

/** Represents outgoing websocket content which Facebook accepts.
 * MUST be json-stringified just before being sent. */
export interface WebsocketContent {
	request_id: number;
	type: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	payload: any; // must be of type "any" - can be either string or object
	app_id: string | number;
}
