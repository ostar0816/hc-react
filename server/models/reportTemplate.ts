'use strict';

import { getDb, ObjectId } from '../mongodb';
import checkPerms from '../utils/checkPerms';
import { Omit } from '../utils/tsTypes';
import { GQLContext } from '../utils/getGraphqlContext';

export type MReportTemplate = {
  _id: ObjectId;
  name: string;
  description: string;
  template: any;
};

export function cReportTemplate() {
  return getDb().collection<MReportTemplate>('reportTemplate');
}

export async function addReportTemplate(
  ctx: GQLContext,
  reportTemplate: Omit<MReportTemplate, '_id'>,
) {
  checkPerms(ctx);

  return cReportTemplate().insertOne(reportTemplate);
}

export async function updateReportTemplate(
  ctx: GQLContext,
  reportTemplateId,
  reportTemplate: Omit<MReportTemplate, '_id'>,
) {
  checkPerms(ctx);

  return (await cReportTemplate().findOneAndUpdate(
    { _id: reportTemplateId },
    {
      $set: reportTemplate,
    },
    { returnOriginal: false },
  )).value;
}

export async function deleteReportTemplate(ctx: GQLContext, reportTemplateId: ObjectId) {
  checkPerms(ctx);

  return cReportTemplate().findOneAndDelete({ _id: reportTemplateId });
}

export async function getReportTemplateById(ctx: GQLContext, reportTemplateId: ObjectId) {
  checkPerms(ctx);

  return cReportTemplate().findOne({ _id: reportTemplateId });
}

export async function listReportTemplates(ctx: GQLContext) {
  checkPerms(ctx);

  return cReportTemplate()
    .find({})
    .sort([['name', 1]])
    .toArray();
}
