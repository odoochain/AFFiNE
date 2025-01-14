import { Button, notify } from '@affine/component';
import {
  RouteLogic,
  useNavigateHelper,
} from '@affine/core/hooks/use-navigate-helper';
import { AuthService } from '@affine/core/modules/cloud';
import { WorkspaceFlavour } from '@affine/env/workspace';
import { useAFFiNEI18N } from '@affine/i18n/hooks';
import { AiIcon } from '@blocksuite/icons';
import { useLiveData, useService, WorkspaceService } from '@toeverything/infra';
import { cssVar } from '@toeverything/theme';
import { useEffect, useRef } from 'react';

import * as styles from './local.dialog.css';
import { edgelessNotifyId$, localNotifyId$ } from './state';
import type { BaseAIOnboardingDialogProps } from './type';

const LocalOnboardingAnimation = () => {
  return (
    <div className={styles.thumb}>
      <video
        className={styles.thumbContent}
        src="/onboarding/ai-onboarding.general.1.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
};

const FooterActions = ({ onDismiss }: { onDismiss: () => void }) => {
  const t = useAFFiNEI18N();
  const authService = useService(AuthService);
  const loginStatus = useLiveData(authService.session.status$);
  const loggedIn = loginStatus === 'authenticated';
  const { jumpToSignIn } = useNavigateHelper();

  return (
    <div className={styles.footerActions}>
      <a href="https://ai.affine.pro" target="_blank" rel="noreferrer">
        <Button className={styles.actionButton} type="plain">
          {t['com.affine.ai-onboarding.local.action-learn-more']()}
        </Button>
      </a>
      {loggedIn ? null : (
        <Button
          className={styles.actionButton}
          type="plain"
          onClick={() => {
            onDismiss();
            jumpToSignIn('/', RouteLogic.REPLACE, {}, { initCloud: 'true' });
          }}
        >
          {t['com.affine.ai-onboarding.local.action-get-started']()}
        </Button>
      )}
    </div>
  );
};

export const AIOnboardingLocal = ({
  onDismiss,
}: BaseAIOnboardingDialogProps) => {
  const t = useAFFiNEI18N();
  const workspaceService = useService(WorkspaceService);
  const notifyId = useLiveData(localNotifyId$);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const isLocal = workspaceService.workspace.flavour === WorkspaceFlavour.LOCAL;

  useEffect(() => {
    if (!isLocal) return;
    if (notifyId) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      // try to close edgeless onboarding
      notify.dismiss(edgelessNotifyId$.value);

      const id = notify(
        {
          title: (
            <div className={styles.title}>
              {t['com.affine.ai-onboarding.local.title']()}
            </div>
          ),
          message: t['com.affine.ai-onboarding.local.message'](),
          icon: <AiIcon />,
          iconColor: cssVar('brandColor'),
          thumb: <LocalOnboardingAnimation />,
          alignMessage: 'icon',
          onDismiss,
          footer: (
            <FooterActions
              onDismiss={() => {
                onDismiss();
                notify.dismiss(id);
              }}
            />
          ),
          rootAttrs: { className: styles.card },
        },
        { duration: 1000 * 60 * 10 }
      );
      localNotifyId$.next(id);
    }, 1000);
  }, [isLocal, notifyId, onDismiss, t]);

  return null;
};
