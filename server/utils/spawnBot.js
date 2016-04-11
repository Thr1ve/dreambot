// This file spawns a new bot, then exports the controller for use elsewhere
import { isDev, slackToken } from './envDefaults';

import Botkit from 'botkit';

const controller = Botkit.slackbot({
  // debug: isDev
});

controller.spawn({
  token: slackToken
}).startRTM();

export default controller;
