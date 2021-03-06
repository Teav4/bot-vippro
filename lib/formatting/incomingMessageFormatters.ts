import Api from '../api';
import {
	AnyIncomingMessage,
	DeliveryReceipt,
	IncomingEvent,
	IncomingEventData,
	IncomingEventType,
	IncomingMessage,
	IncomingMessageReaction,
	IncomingMessageReply,
	IncomingMessageType,
	IncomingMessageUnsend,
	ReadReceipt
} from '../types/incomingMessages';
import { UserID } from '../types/users';
import {
	AnyAttachment,
	AttachmentAnimatedImage,
	AttachmentAudio,
	AttachmentFile,
	AttachmentImage,
	AttachmentSticker,
	AttachmentType,
	AttachmentVideo
} from '../types/attachments';

export function parseDelta(delta: any, api: Api): AnyIncomingMessage[] {
	if (delta.class === 'NewMessage') {
		let formattedMessage: IncomingMessage;
		try {
			formattedMessage = formatDeltaMessage(delta);
		} catch (error) {
			throw new Error(
				`There was an unknown WS error. Contact the dev team about this (error code 935468). Original error: ${error}. Delta: ${JSON.stringify(
					delta
				)}`
			);
		}
		if (!formattedMessage) throw new Error('Error code 935468-b');

		if (api.ctx.globalOptions.autoMarkDelivery) {
			// this._markDelivery(fmtMsg.threadID, fmtMsg.messageID);
		}
		if (!api.ctx.globalOptions.selfListen && formattedMessage.senderId == api.ctx.userID) return [];
		return [formattedMessage];
	}
	if (delta.class == 'ClientPayload') {
		let clientPayload;
		try {
			// if the `delta.payload` property is used, it contains an array
			// of 8-bit integers which are later converted to string
			clientPayload = JSON.parse(Buffer.from(delta.payload).toString());
		} catch (error) {
			throw new Error(
				`There was an error parsing WS. Contact the dev team about this (error code 935469). Original error: ${error}. Delta: ${JSON.stringify(
					delta
				)}`
			);
		}
		if (!(clientPayload && clientPayload.deltas)) throw new Error('Error code 935469-b');

		const toBeReturned: AnyIncomingMessage[] = [];

		for (const payloadDelta of clientPayload.deltas) {
			if (payloadDelta.deltaMessageReaction && api.ctx.globalOptions.listenEvents) {
				const messageReaction: IncomingMessageReaction = {
					type: IncomingMessageType.MessageReaction,
					threadId: parseInt(
						payloadDelta.deltaMessageReaction.threadKey.threadFbId ||
							payloadDelta.deltaMessageReaction.threadKey.otherUserFbId
					),
					messageId: payloadDelta.deltaMessageReaction.messageId,
					reaction: payloadDelta.deltaMessageReaction.reaction,
					messageSenderId: parseInt(payloadDelta.deltaMessageReaction.senderId),
					reactionSenderId: parseInt(payloadDelta.deltaMessageReaction.userId)
				};
				toBeReturned.push(messageReaction);
			} else if (payloadDelta.deltaRecallMessageData && api.ctx.globalOptions.listenEvents) {
				// "unsend message" by FB is called "recall message"
				const messageUnsend: IncomingMessageUnsend = {
					type: IncomingMessageType.MessageUnsend,
					threadId: parseInt(
						payloadDelta.deltaRecallMessageData.threadKey.threadFbId ||
							payloadDelta.deltaRecallMessageData.threadKey.otherUserFbId
					),
					messageId: payloadDelta.deltaRecallMessageData.messageID,
					messageSenderId: parseInt(payloadDelta.deltaRecallMessageData.senderID),
					deletionTimestamp: parseInt(payloadDelta.deltaRecallMessageData.deletionTimestamp)
				};
				toBeReturned.push(messageUnsend);
			} else if (payloadDelta.deltaMessageReply) {
				let replyMessage: IncomingMessageReply;
				try {
					replyMessage = formatDeltaReplyMessage(
						payloadDelta.deltaMessageReply.repliedToMessage,
						payloadDelta.deltaMessageReply.message
					);
				} catch (error) {
					throw new Error(
						`There was an unknown WS error. Contact the dev team about this (error code 935470). Original error: ${error}. Delta: ${JSON.stringify(
							delta
						)}`
					);
				}
				if (!replyMessage) throw new Error('Error code 935470-b');

				if (api.ctx.globalOptions.autoMarkDelivery) {
					// this._markDelivery(fmtMsg.threadID, fmtMsg.messageID);
				}
				toBeReturned.push(replyMessage);
			}
		}
		return toBeReturned;
	}

	if (delta.class !== 'NewMessage' && !api.ctx.globalOptions.listenEvents) return [];

	switch (delta.class) {
		case 'DeliveryReceipt': {
			let formattedDelivery: DeliveryReceipt;
			try {
				formattedDelivery = formatDeltaDeliveryReceipt(delta);
			} catch (error) {
				throw new Error(
					`There was an unknown WS error. Contact the dev team about this (error code 935471). Original error: ${error}. Delta: ${JSON.stringify(
						delta
					)}`
				);
			}
			if (!formattedDelivery) throw new Error('Error code 935471-b');
			return [formattedDelivery];
		}
		case 'ReadReceipt': {
			let formattedMessage: ReadReceipt;
			try {
				formattedMessage = formatDeltaReadReceipt(delta);
			} catch (error) {
				throw new Error(
					`There was an unknown WS error. Contact the dev team about this (error code 935472). Original error: ${error}. Delta: ${JSON.stringify(
						delta
					)}`
				);
			}
			if (!formattedMessage) throw new Error('Error code 935472-b');
			return [formattedMessage];
		}
		case 'AdminTextMessage':
		case 'ThreadName':
		case 'ParticipantsAddedToGroupThread':
		case 'ParticipantLeftGroupThread': {
			let formattedAdminText: IncomingEvent;
			try {
				formattedAdminText = formatDeltaEvent(delta);
			} catch (error) {
				throw new Error(
					`There was an unknown WS error. Contact the dev team about this (error code 935473). Original error: ${error}. Delta: ${JSON.stringify(
						delta
					)}`
				);
			}
			if (!formattedAdminText) throw new Error('Error code 935473-b');
			return [formattedAdminText];
		}
		default:
			break;
	}
	return [];
}

function formatDeltaMessage(delta: any): IncomingMessage {
	const messageMetadata = delta.messageMetadata;

	// mention data
	const mentions: { name: string; id: UserID }[] = [];
	if (delta.data?.prng) {
		// FB stores the mention data in "data.prng", but I have no idea what the letters stand for :-(
		let mentionRawData;
		try {
			mentionRawData = JSON.parse(delta.data.prng);
		} finally {
			if (mentionRawData instanceof Array)
				for (const onePerson of mentionRawData)
					mentions.push({
						name: delta.body?.substring(onePerson.o, onePerson.o + onePerson.l),
						id: parseInt(onePerson.i)
					});
		}
	}

	const formatted: IncomingMessage = {
		type: IncomingMessageType.MessageRegular,
		senderId: parseInt(messageMetadata.actorFbId),
		body: delta.body || '',
		// when one-to-one chat, `otherUserFbId` is used by FB
		// when group chat, `threadFbId` is used by FB
		threadId: parseInt(messageMetadata.threadKey.threadFbId || messageMetadata.threadKey.otherUserFbId),
		messageId: messageMetadata.messageId,
		attachments: formatAttachments(delta.attachments),
		mentions,
		timestamp: parseInt(messageMetadata.timestamp),
		isGroup: !!messageMetadata.threadKey.threadFbId
	};
	return formatted;
}

function formatDeltaReplyMessage(deltaSourceMessage: any, deltaReplyMessage: any): IncomingMessageReply {
	// since the reply incoming message has very similar structure as regular incoming message,
	// we can format it using `formatDeltaMessage` function & add some additional properties
	const formattedReplyMessage: any = {
		...formatDeltaMessage(deltaReplyMessage), // format using another function
		// and add some additional properties:
		sourceMessage: formatDeltaMessage(deltaSourceMessage)
	};
	formattedReplyMessage.type = IncomingMessageType.MessageReply;
	return formattedReplyMessage as IncomingMessageReply;
}

export function getAdminTextMessageType(type: string): IncomingEventType | undefined {
	switch (type) {
		case 'change_thread_theme':
			return IncomingEventType.ChangeThreadColorTheme;
		case 'change_thread_nickname':
			return IncomingEventType.ChangeNickname;
		case 'change_thread_icon':
			return IncomingEventType.ChangeThreadImage;
		default:
			return undefined;
	}
}

function formatDeltaEvent(delta: any): IncomingEvent {
	let eventType: IncomingEventType | undefined;
	let additionalData: IncomingEventData = {};

	switch (delta.class) {
		case 'AdminTextMessage':
			if (!(delta.type && delta.untypedData)) break;
			switch (delta.type) {
				case 'change_thread_theme':
					eventType = IncomingEventType.ChangeThreadColorTheme;
					additionalData = {
						newThreadColorTheme: {
							should_show_icon: delta.untypedData.should_show_icon == '1',
							theme_color: delta.untypedData.theme_color,
							accessibility_label: delta.untypedData.accessibility_label,
							theme_name_with_subtitle: delta.untypedData.theme_name_with_subtitle,
							gradient: delta.untypedData.gradient ? JSON.parse(delta.untypedData.gradient) : undefined
						}
					};
					break;
				case 'change_thread_nickname':
					eventType = IncomingEventType.ChangeNickname;
					// FB doesn't have nickname changing functional as of 21/3/2021
					break;
				case 'change_thread_icon':
					eventType = IncomingEventType.ChangeThreadEmoji;
					additionalData = { newThreadEmoji: delta.untypedData };
					break;
				case 'change_thread_admins':
					eventType = IncomingEventType.ChangeAdminStatus;
					additionalData = {
						changeAdminInfo: {
							targetId: parseInt(delta.untypedData.TARGET_ID),
							isAdminFromNow: delta.untypedData.ADMIN_EVENT === 'add_admin'
						}
					};
					break;
				default:
					additionalData = delta.untypedData;
					eventType = getAdminTextMessageType(delta.type);
					break;
			}
			break;
		case 'ThreadName':
			eventType = IncomingEventType.ChangeThreadName;
			additionalData = { newThreadName: delta.name };
			break;
		case 'ParticipantsAddedToGroupThread':
			eventType = IncomingEventType.AddedParticipants;
			additionalData = {
				addedParticipants: delta.addedParticipants.map((p: any) => ({
					firstName: p.firstName,
					fullName: p.fullName,
					userId: parseInt(p.userFbId)
				}))
			};
			break;
		case 'ParticipantLeftGroupThread':
			eventType = IncomingEventType.RemovedParticipant;
			additionalData = { leftParticipantFbId: parseInt(delta.leftParticipantFbId) };
			break;
		default:
			break;
	}

	return {
		type: IncomingMessageType.ThreadEvent,
		threadId: parseInt(delta.messageMetadata.threadKey.threadFbId || delta.messageMetadata.threadKey.otherUserFbId),
		senderId: parseInt(delta.messageMetadata.actorFbId),
		body: delta.messageMetadata.adminText,
		timestamp: parseInt(delta.messageMetadata.timestamp),
		eventType,
		data: additionalData
	};
}

function formatDeltaDeliveryReceipt(delta: any): DeliveryReceipt {
	return {
		type: IncomingMessageType.DeliveryReceipt,
		timestamp: parseInt(delta.deliveredWatermarkTimestampMs),
		threadId: parseInt(delta.threadKey.otherUserFbId || delta.threadKey.threadFbId),
		recipient: parseInt(delta.actorFbId || delta.threadKey.otherUserFbId),
		deliveredMessageIds: delta.messageIds
	};
}

function formatDeltaReadReceipt(delta: any): ReadReceipt {
	return {
		type: IncomingMessageType.ReadReceipt,
		reader: parseInt(delta.actorFbId || delta.threadKey.otherUserFbId),
		timestamp: parseInt(delta.actionTimestampMs),
		threadId: parseInt(delta.threadKey.otherUserFbId || delta.threadKey.threadFbId)
	};
}

// other helping functions
function formatAttachments(rawData: any): AnyAttachment[] {
	if (!rawData || !rawData.length || rawData.length === 0) return [];

	return (rawData as any[])
		.map(att => {
			// some information can be retrieved from `mercuryJSON` attribute
			if (att.mercuryJSON && !att.mercury) att.mercury = JSON.parse(att.mercuryJSON);

			// we can have multiple attachment types,
			// all defined in either `blob_attachment` (the normal attachments) or `sticker_attachment` (the crazy ones)

			let attDetails = att.mercury?.blob_attachment;
			if (attDetails) {
				const semiformattedAttachment = {
					// `fbid`, `id` and `hash` have the same value
					// but we can be more confident that this will work even when FB changes something
					attachmentId: parseInt(att.fbid ?? att.id ?? att.hash),
					fileSize: parseInt(att.fileSize ?? att.filesize),
					fileName: att.filename || att.fileName || '',
					mimeType: att.mimeType || ''
				};
				switch (attDetails.__typename) {
					case 'MessageImage':
						return {
							type: AttachmentType.Image,
							...semiformattedAttachment,
							previewSmall: attDetails.preview,
							previewLarge: attDetails.large_preview,
							thumbnailUrl: attDetails.thumbnail?.uri || '',
							originalDimensions: attDetails.original_dimensions,
							originalExtension: attDetails.original_extension
						} as AttachmentImage;
					case 'MessageVideo':
						return {
							type: AttachmentType.Video,
							...semiformattedAttachment,
							chatImage: attDetails.chat_image,
							largeImage: attDetails.large_image,
							inboxImage: attDetails.inbox_image,

							videoType: attDetails.video_type,
							playableUrl: attDetails.playable_url,
							originalDimensions: attDetails.original_dimensions,
							duration: parseInt(attDetails.playable_duration_in_ms)
						} as AttachmentVideo;
					case 'MessageAudio':
						return {
							type: AttachmentType.Audio,
							...semiformattedAttachment,
							playableUrl: attDetails.playable_url,
							duration: parseInt(attDetails.playable_duration_in_ms),
							isVoiceMail: attDetails.is_voicemail,
							// can be either `VOICE_MESSAGE` or `FILE_ATTACHMENT`
							audioType: attDetails.audio_type
						} as AttachmentAudio;
					case 'MessageFile':
						return {
							type: AttachmentType.File,
							...semiformattedAttachment,
							url: attDetails.url,
							isMalicious: attDetails.is_malicious
						} as AttachmentFile;
					case 'MessageAnimatedImage':
						return {
							type: AttachmentType.Gif,
							...semiformattedAttachment,
							attributionApp: attDetails.attribution_app,
							animatedImage: attDetails.animated_image,
							previewImage: attDetails.preview_image,
							originalDimensions: attDetails.original_dimensions
						} as AttachmentAnimatedImage;
					default:
						break;
				}
			}

			attDetails = att.mercury?.sticker_attachment;
			if (attDetails) {
				// Hey Facebook! I see you're a man of culture as well :-)
				// there is everything useful here, no need to parse
				// moreover, nobody really uses stickers anyway
				return { type: AttachmentType.Sticker, info: attDetails } as AttachmentSticker;
			}
			// TODO: add invalid data collector
		})
		.filter(parsed => Boolean(parsed)) as AnyAttachment[]; // return only defined attachments
}
