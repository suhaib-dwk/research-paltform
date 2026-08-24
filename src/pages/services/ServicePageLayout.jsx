import { useParams, Navigate } from 'react-router-dom';
import { useSite } from '../../SiteContext';

import ReviewServicePage from './ReviewServicePage';
import TranslationPage from './TranslationPage';
import ProofreadingPage from './ProofreadingPage';
import ConsultationPage from './ConsultationPage';
import AiAssistantPage from './AiAssistantPage';
import JournalSelectionPage from './JournalSelectionPage';
import JournalEvaluationPage from './JournalEvaluationPage';
import TemplatePage from './TemplatePage';
import CorrespondencePage from './CorrespondencePage';
import PublicationPage from './PublicationPage';

const SERVICE_MAP = {
  'review': ReviewServicePage,
  'translation': TranslationPage,
  'proofreading': ProofreadingPage,
  'consultation': ConsultationPage,
  'ai-assistant': AiAssistantPage,
  'journal-selection': JournalSelectionPage,
  'journal-evaluation': JournalEvaluationPage,
  'template': TemplatePage,
  'correspondence': CorrespondencePage,
  'publication': PublicationPage,
};

const ServicePageLayout = () => {
  const { slug } = useParams();
  const { currentLang } = useSite();
  const PageComponent = SERVICE_MAP[slug];

  if (!PageComponent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400 dark:text-gray-500">
        <p className="text-lg mb-2">
          {currentLang === 'ar' ? 'الخدمة غير موجودة' : 'Service not found'}
        </p>
        <p className="text-sm mb-4">
          {currentLang === 'ar' ? 'الخدمة التي تبحث عنها غير متوفرة حالياً' : 'The service you are looking for is not available'}
        </p>
        <Navigate to="/dashboard" replace />
      </div>
    );
  }

  return <PageComponent />;
};

export default ServicePageLayout;