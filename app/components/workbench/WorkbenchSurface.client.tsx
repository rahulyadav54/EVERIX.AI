import { useStore } from '@nanostores/react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { computed } from 'nanostores';
import { memo, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  type OnChangeCallback as OnEditorChange,
  type OnScrollCallback as OnEditorScroll,
} from '~/components/editor/codemirror/CodeMirrorEditor';
import { IconButton } from '~/components/ui/IconButton';
import { PanelHeaderButton } from '~/components/ui/PanelHeaderButton';
import { Slider, type SliderOptions } from '~/components/ui/Slider';
import { workbenchStore, type WorkbenchViewType } from '~/lib/stores/workbench';
import { classNames } from '~/utils/classNames';
import { cubicEasingFn } from '~/utils/easings';
import { renderLogger } from '~/utils/logger';
import { EditorPanel } from './EditorPanel';
import { Preview } from './Preview';

interface WorkbenchSurfaceProps {
  isStreaming?: boolean;
  layout?: 'overlay' | 'embedded';
  mobileView?: 'code' | 'preview';
}

const viewTransition = { ease: cubicEasingFn };

const sliderOptions: SliderOptions<WorkbenchViewType> = {
  left: { value: 'code', text: 'Code' },
  right: { value: 'preview', text: 'Preview' },
};

export const WorkbenchSurface = memo(({ isStreaming, layout = 'embedded', mobileView }: WorkbenchSurfaceProps) => {
  renderLogger.trace('WorkbenchSurface');

  const hasPreview = useStore(computed(workbenchStore.previews, (previews) => previews.length > 0));
  const selectedFile = useStore(workbenchStore.selectedFile);
  const currentDocument = useStore(workbenchStore.currentDocument);
  const unsavedFiles = useStore(workbenchStore.unsavedFiles);
  const files = useStore(workbenchStore.files);
  const selectedView = useStore(workbenchStore.currentView);

  const setSelectedView = (view: WorkbenchViewType) => {
    workbenchStore.currentView.set(view);
  };

  useEffect(() => {
    if (layout === 'embedded') {
      workbenchStore.showWorkbench.set(true);
    }
  }, [layout]);

  useEffect(() => {
    if (hasPreview) {
      setSelectedView('preview');
    }
  }, [hasPreview]);

  useEffect(() => {
    if (mobileView === 'preview') {
      setSelectedView('preview');
    } else if (mobileView === 'code') {
      setSelectedView('code');
    }
  }, [mobileView]);

  useEffect(() => {
    workbenchStore.setDocuments(files);
  }, [files]);

  const onEditorChange = useCallback<OnEditorChange>((update) => {
    workbenchStore.setCurrentDocumentContent(update.content);
  }, []);

  const onEditorScroll = useCallback<OnEditorScroll>((position) => {
    workbenchStore.setCurrentDocumentScrollPosition(position);
  }, []);

  const onFileSelect = useCallback((filePath: string | undefined) => {
    workbenchStore.setSelectedFile(filePath);
  }, []);

  const onFileSave = useCallback(() => {
    workbenchStore.saveCurrentDocument().catch(() => {
      toast.error('Failed to update file content');
    });
  }, []);

  const onFileReset = useCallback(() => {
    workbenchStore.resetCurrentDocument();
  }, []);

  const view = mobileView ? (mobileView === 'preview' ? 'preview' : 'code') : selectedView;

  return (
    <div className={classNames('h-full flex flex-col min-h-0', layout === 'embedded' && 'everix-workbench-panel everix-glass-panel rounded-xl overflow-hidden')}>
      <div className="flex items-center px-3 py-2 border-b border-bolt-elements-borderColor bg-bolt-elements-background-depth-1/50 shrink-0">
        <Slider selected={view} options={sliderOptions} setSelected={setSelectedView} />
        <div className="ml-auto flex items-center gap-1">
          {view === 'code' && (
            <PanelHeaderButton
              className="text-sm hidden sm:flex"
              onClick={() => workbenchStore.toggleTerminal(!workbenchStore.showTerminal.get())}
            >
              <div className="i-ph:terminal" />
              Terminal
            </PanelHeaderButton>
          )}
          {layout === 'overlay' && (
            <IconButton
              icon="i-ph:x-circle"
              className="-mr-1"
              size="xl"
              onClick={() => workbenchStore.showWorkbench.set(false)}
            />
          )}
        </div>
      </div>
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <View initial={{ x: view === 'code' ? 0 : '-100%' }} animate={{ x: view === 'code' ? 0 : '-100%' }}>
          <EditorPanel
            editorDocument={currentDocument}
            isStreaming={isStreaming}
            selectedFile={selectedFile}
            files={files}
            unsavedFiles={unsavedFiles}
            onFileSelect={onFileSelect}
            onEditorScroll={onEditorScroll}
            onEditorChange={onEditorChange}
            onFileSave={onFileSave}
            onFileReset={onFileReset}
          />
        </View>
        <View initial={{ x: view === 'preview' ? 0 : '100%' }} animate={{ x: view === 'preview' ? 0 : '100%' }}>
          <Preview />
        </View>
      </div>
    </div>
  );
});

interface ViewProps extends HTMLMotionProps<'div'> {
  children: JSX.Element;
}

const View = memo(({ children, ...props }: ViewProps) => {
  return (
    <motion.div className="absolute inset-0" transition={viewTransition} {...props}>
      {children}
    </motion.div>
  );
});
