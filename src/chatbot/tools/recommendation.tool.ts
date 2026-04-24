import { FunctionTool } from '@google/adk';
import { z } from 'zod';
import { RecommenderService } from '../../recommender/recommender.service';

export const createRecommendationsTool = (
  userId: string,
  recommenderService: RecommenderService,
) => {
  return new FunctionTool({
    name: 'get_recommendations',
    description: 'Get personalised book recommendations for the user',
    parameters: z.object({}),
    execute: async () => {
      return recommenderService.getRecommendationsForUser(userId);
    },
  });
};
