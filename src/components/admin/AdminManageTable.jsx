import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Database } from 'lucide-react';
import AdminDataTable from './AdminDataTable';
import { tableConfigs } from '../../config/tableConfigs';

const AdminManageTable = () => {
  const { tableName } = useParams();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const config = tableConfigs[tableName];

  if (!config) {
    return (
      <div className="text-center py-20 text-gray-500">
        <Database className="w-16 h-16 mx-auto mb-4 opacity-30" />
        <p className="text-xl font-bold">{isRTL ? 'الجدول غير موجود' : 'Table Not Found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <Database className="w-7 h-7 text-blue-500" />
          {isRTL ? config.title_ar : config.title_en}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {isRTL ? `عرض وإدارة جدول (${tableName}) في قاعدة البيانات` : `View and manage (${tableName}) table in database`}
        </p>
      </div>

      <AdminDataTable 
        tableName={tableName} 
        columns={config.columns} 
        readOnly={config.readOnly} 
      />
    </div>
  );
};

export default AdminManageTable;