import { Injectable } from '@nestjs/common';
import { ConversationsService } from 'conversations/conversations.service';

import { PrismaService } from 'prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    private prismaService: PrismaService,
    private conversationsService: ConversationsService,
  ) {}

  async create({ conversationId, message, sender }: CreateMessageDto) {
    const conversation = await this.prismaService.conversation.findUnique({
      where: { id: conversationId },
    });

    const { userId, groupId } = await this.prismaService.message.create({
      data: {
        user: { connect: { id: sender } },
        group: { connect: { id: conversation.groupId } },
        content: message,
        createdAt: Date.now(),
      },
    });

    await this.conversationsService.pushConversation(userId, groupId);
  }

  async findAll(conversationId: string) {
    const {
      group: { messages },
    } = await this.prismaService.conversation.findUnique({
      where: { id: conversationId },
      select: {
        group: {
          select: {
            messages: {
              select: {
                content: true,
                createdAt: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return messages;
  }
}
