import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { defineModuleConfig, ModuleConfig } from '../config-new';

declare module '../config-new' {
  interface AppConfig {
    /**
     * Configurations for mail service used to post auth or bussiness mails.
     *
     * @see https://nodemailer.com/smtp/
     */
    mailer: ModuleConfig<SMTPTransport.Options>;
  }
}

defineModuleConfig('mailer', {
  startup: {},
});
