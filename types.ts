
export enum ActiveTool {
  Campaign = 'Campaign',
  Image = 'Image',
  Chat = 'Chat',
}

export enum MessageSender {
  User = 'user',
  Bot = 'bot',
}

export interface ChatMessage {
  sender: MessageSender;
  text: string;
}

export interface EmailCampaign {
  subject: string;
  body: string;
  imageUrl: string;
}
