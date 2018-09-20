import { GQLNoteMessageTypeResolver } from '../types';
import { MStudyNoteMessage } from '../../models/study';
import { getUserById } from '../../models/user';

export const studyNoteMessageResolvers: GQLNoteMessageTypeResolver<MStudyNoteMessage> = {
  createdBy(message, {}, ctx) {
    return getUserById(ctx, message.createdById);
  },
};
