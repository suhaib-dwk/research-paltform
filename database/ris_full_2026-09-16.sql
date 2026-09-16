-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: ris
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `academic_quality_elements`
--

DROP TABLE IF EXISTS `academic_quality_elements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `academic_quality_elements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `standard_id` int(11) NOT NULL DEFAULT 1,
  `element_number` int(11) NOT NULL,
  `title_ar` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `standard_id` (`standard_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_quality_elements`
--

LOCK TABLES `academic_quality_elements` WRITE;
/*!40000 ALTER TABLE `academic_quality_elements` DISABLE KEYS */;
INSERT INTO `academic_quality_elements` VALUES (1,1,1,'بيئة البحث العلمي','Research Environment',1),(2,1,2,'تمويل البحث العلمي','Research Funding',2),(3,1,3,'نشر البحث العلمي','Research Publishing',3),(4,1,4,'تسويق البحث العلمي','Research Marketing',4),(5,1,5,'الإبداع والابتكار','Creativity and Innovation',5),(6,1,6,'أخلاقيات البحث العلمي','Research Ethics',6),(7,1,7,'مصادر المعلومات','Information Resources',7),(8,1,8,'التعاون الدولي في الأنشطة العلمية والبحثية','International Collaboration in Scientific Activities',8);
/*!40000 ALTER TABLE `academic_quality_elements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `academic_quality_entity_responses`
--

DROP TABLE IF EXISTS `academic_quality_entity_responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `academic_quality_entity_responses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entity_id` int(11) NOT NULL,
  `university_id` int(11) DEFAULT NULL,
  `indicator_id` int(11) NOT NULL,
  `reporting_period` varchar(20) NOT NULL,
  `actual_value` decimal(14,2) DEFAULT NULL,
  `target_value` decimal(14,2) DEFAULT NULL,
  `maturity_level` tinyint(4) DEFAULT NULL,
  `compliance_level` enum('none','partial','full') DEFAULT NULL,
  `assessment` enum('not_verified','partial','full') NOT NULL DEFAULT 'not_verified',
  `evidence_quality` tinyint(4) DEFAULT NULL,
  `score` decimal(6,2) NOT NULL DEFAULT 0.00,
  `gap_notes` text DEFAULT NULL,
  `corrective_action` text DEFAULT NULL,
  `owner_name` varchar(255) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'draft',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_university_indicator_period` (`university_id`,`indicator_id`,`reporting_period`),
  KEY `fk_aqer_indicator` (`indicator_id`),
  KEY `idx_quality_response_university` (`university_id`),
  CONSTRAINT `fk_aqer_indicator` FOREIGN KEY (`indicator_id`) REFERENCES `academic_quality_indicators` (`id`),
  CONSTRAINT `fk_quality_response_university` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_quality_entity_responses`
--

LOCK TABLES `academic_quality_entity_responses` WRITE;
/*!40000 ALTER TABLE `academic_quality_entity_responses` DISABLE KEYS */;
INSERT INTO `academic_quality_entity_responses` VALUES (4,18,1,1,'2026-2027',NULL,NULL,NULL,'full','not_verified',NULL,6.00,'','','',NULL,'submitted','2026-09-14 21:07:10','2026-08-31 15:26:30'),(5,18,1,18,'2026-2027',NULL,NULL,75,NULL,'partial',NULL,6.00,'','','',NULL,'submitted','2026-09-14 21:02:58','2026-08-31 15:26:38'),(6,18,1,11,'2026-2027',50.00,100.00,NULL,NULL,'full',NULL,3.00,'','','',NULL,'submitted','2026-09-14 21:02:58','2026-08-31 15:26:38'),(7,18,1,2,'2026-2027',NULL,NULL,50,NULL,'partial',NULL,3.00,'','','',NULL,'submitted','2026-09-14 21:02:58','2026-08-31 15:26:46');
/*!40000 ALTER TABLE `academic_quality_entity_responses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `academic_quality_evidence_files`
--

DROP TABLE IF EXISTS `academic_quality_evidence_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `academic_quality_evidence_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `response_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `uploaded_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_aqef_response` (`response_id`),
  CONSTRAINT `fk_aqef_response` FOREIGN KEY (`response_id`) REFERENCES `academic_quality_entity_responses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_quality_evidence_files`
--

LOCK TABLES `academic_quality_evidence_files` WRITE;
/*!40000 ALTER TABLE `academic_quality_evidence_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `academic_quality_evidence_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `academic_quality_indicators`
--

DROP TABLE IF EXISTS `academic_quality_indicators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `academic_quality_indicators` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `element_id` int(11) NOT NULL,
  `indicator_number` int(11) NOT NULL,
  `code` varchar(20) NOT NULL,
  `title_ar` varchar(500) NOT NULL,
  `title_en` varchar(500) DEFAULT NULL,
  `indicator_type` enum('compliance','quantitative','percentage','maturity') NOT NULL,
  `max_score` decimal(6,2) NOT NULL DEFAULT 100.00,
  `description` text DEFAULT NULL,
  `required_inputs` text DEFAULT NULL,
  `required_evidence` text DEFAULT NULL,
  `module_name` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `fk_aqi_element` (`element_id`),
  CONSTRAINT `fk_aqi_element` FOREIGN KEY (`element_id`) REFERENCES `academic_quality_elements` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_quality_indicators`
--

LOCK TABLES `academic_quality_indicators` WRITE;
/*!40000 ALTER TABLE `academic_quality_indicators` DISABLE KEYS */;
INSERT INTO `academic_quality_indicators` VALUES (1,1,1,'IND-01','وجود جهة مؤسسية تتولى خطة البحث العلمي','Existence of an institutional unit responsible for the scientific research plan','compliance',6.00,'وجود جهة أو وحدة أو قسم رسمي مسؤول عن التخطيط للبحث العلمي واعتماد وتنفيذ خطة البحث العلمي في الجامعة.','اسم الجهة، الهيكل التنظيمي، المسؤول، تاريخ التشكيل، خطة البحث العلمي، تاريخ اعتماد الخطة، مدة الخطة، أهداف الخطة','قرار التشكيل، الهيكل التنظيمي، خطة البحث العلمي، محضر اعتماد الخطة','Institutional Research Governance Module',1),(2,1,2,'IND-02','مشاركة الجهات المستفيدة في صياغة خطة البحث','Participation of beneficiary stakeholders in formulating the research plan','maturity',6.00,'قياس مدى إشراك أصحاب المصلحة (القطاع الخاص، الحكومة، المجتمع، المؤسسات الإنتاجية/الصحية/التعليمية، الجهات المهنية) في تحديد الأولويات البحثية.','اسم الجهة، نوع الجهة، تاريخ المشاركة، طريقة المشاركة، الموضوع، التوصيات، المخرجات','محاضر الاجتماعات، ورش العمل، الاستبيانات، الكتب الرسمية، التوصيات','Stakeholder Engagement Module',2),(3,1,3,'IND-03','ارتباط خطة البحث بسوق العمل والمجتمع','Alignment of the research plan with labor market and community needs','maturity',6.00,'قياس مدى ارتباط الأولويات البحثية بالاحتياجات الحقيقية للبلد والمجتمع وسوق العمل.','أولوية البحث، المشكلة الوطنية، احتياج سوق العمل، القطاع المستهدف، الجهة المستفيدة، نوع الأثر المتوقع','دراسات الاحتياجات، تقارير سوق العمل، وثائق الخطة، الدراسات الاستراتيجية','Research Priority Mapping',3),(4,1,4,'IND-04','الالتزام بسياسات الابتعاث والبحث العلمي','Commitment to scholarship and scientific research policies','compliance',4.00,'وجود سياسات وتعليمات واضحة للابتعاث والبحث العلمي وتطبيقها.','سياسة الابتعاث، تعليمات البحث العلمي، عدد المبتعثين، التخصصات، الدول، الجامعات، مدة الابتعاث، نتائج الابتعاث','السياسات، القرارات، التقارير، سجلات الابتعاث','Research & Scholarship Policy Module',4),(5,1,5,'IND-05','تحفيز الباحثين','Researcher incentives','maturity',4.00,'قياس وجود نظام مؤسسي لتحفيز الباحثين (حوافز النشر، الجوائز، المنح، دعم المؤتمرات والنشر، تخفيض النصاب، الحوافز المعنوية).','حوافز النشر، الجوائز، المنح، دعم المؤتمرات، دعم النشر، تخفيض النصاب، الحوافز المعنوية','سياسة الحوافز، القرارات، قوائم المستفيدين، تقارير الصرف','Researcher Incentives Module',5),(6,1,6,'IND-06','مستلزمات البحث العلمي','Scientific research requisites','percentage',6.00,'قياس مدى توفر البنية التحتية التي يحتاجها الباحث (مختبرات، أجهزة، برمجيات، قواعد بيانات، مرافق).','المختبرات، الأجهزة، البرمجيات، قواعد البيانات، المرافق، الطاقة الاستيعابية، نسبة الاستخدام، حالة المعدات','سجل الأصول، قوائم المعدات، عقود البرمجيات، تقارير الاستخدام','Research Infrastructure & Assets Module',6),(7,1,7,'IND-07','صيانة البنية التحتية والمعدات','Maintenance of infrastructure and equipment','compliance',6.00,'قياس وجود نظام صيانة ومعايرة للمعدات البحثية. يستطيع النظام إرسال تنبيه عند اقتراب موعد الصيانة (خلال 30 يومًا).','اسم الجهاز، الرقم التعريفي، تاريخ الشراء، آخر صيانة، الصيانة القادمة، حالة الجهاز، المعايرة','سجلات الصيانة، العقود، شهادات المعايرة','Research Asset Maintenance',7),(8,1,8,'IND-08','سياسات ملكية معدات البحث','Policies on ownership of research equipment','compliance',4.00,'تحديد من يملك المعدات ومن يديرها ومن يتحمل مسؤولية صيانتها واستخدامها.','المعدات، المالك، مصدر التمويل، الجهة المستخدمة، مسؤول الصيانة، سياسة الاستخدام','سياسة الملكية، سجل الأصول، القرارات',NULL,8),(9,1,9,'IND-09','الصحة والسلامة المهنية للباحثين','Occupational health and safety of researchers','compliance',6.00,'وجود نظام للسلامة وحماية الباحثين، خصوصًا في المختبرات والمرافق البحثية.','سياسة السلامة، تقييم المخاطر، التدريب، معدات الحماية، إجراءات الطوارئ، الحوادث','سجلات التدريب، تقارير التفتيش، تقييم المخاطر','Research Health & Safety Compliance',9),(10,1,10,'IND-10','المحافظة على البيئة','Environmental protection','compliance',6.00,'قياس التزام الأنشطة البحثية بالمتطلبات البيئية.','النفايات، المواد الخطرة، طريقة التخلص، الإجراءات البيئية، الحوادث','السياسة البيئية، سجلات النفايات، التقارير',NULL,10),(11,2,11,'IND-11','وجود موازنة سنوية كافية للبحث العلمي','Availability of an adequate annual budget for scientific research','quantitative',6.00,'قياس حجم الموارد المالية المخصصة فعليًا للبحث العلمي. مؤشرات مشتقة: Research Budget، Research Spending Rate، Research Budget per Faculty، External Funding Rate.','موازنة البحث، الإنفاق الفعلي، المنح الداخلية، المنح الخارجية، دعم المؤتمرات، دعم النشر',NULL,'Research Finance Module',11),(12,2,12,'IND-12','أولوية البحوث ذات المردود الاقتصادي','Priority for research with economic return','maturity',6.00,'قياس قدرة الجامعة على دعم الأبحاث التي يمكن أن تحقق قيمة اقتصادية أو إنتاجية.','عدد الأبحاث التطبيقية، المشاريع، القطاع المستفيد، التقنية، العائد المتوقع، الأثر الاقتصادي','تقارير المشاريع، العقود، الشراكات','Research Economic Impact Module',12),(13,2,13,'IND-13','قدرة الجهة البحثية على تحديد الخبرات والفرص التجارية','Ability to identify expertise and commercial opportunities','maturity',6.00,'قدرة الجامعة على معرفة: من يملك الخبرة؟ ما التقنية الموجودة؟ ما السوق المحتمل؟ من الشريك الصناعي؟','الباحث، التخصص، الخبرة، التقنية، براءات الاختراع، السوق المحتمل، القطاع',NULL,'Research Expertise Marketplace',13),(14,2,14,'IND-14','المشاركة في مشاريع ممولة محليًا ودوليًا','Participation in locally and internationally funded projects','quantitative',6.00,'مؤشرات مشتقة: Number of Grants، Total Funding، International Funding، External Funding Rate، Funding per Researcher.','اسم المشروع، الباحث الرئيسي، الفريق، مصدر التمويل، الدولة، قيمة التمويل، مدة المشروع، الشريك',NULL,'Grant Management System',14),(15,3,15,'IND-15','توجيه وتحفيز النشر في المجلات العالمية ذات معامل التأثير','Encouraging publication in high-impact-factor international journals','percentage',6.00,'النظام يستطيع حساب: Indexed Publication Rate، Q1 Publication Rate، Q1+Q2 Publication Rate، Publication per Faculty، International Collaboration Rate، Citation Impact.','Publication ID، عنوان البحث، المؤلفون، الباحث، Researcher ID، المجلة، ISSN، الناشر، Scopus، Web of Science، Quartile، Impact Factor، CiteScore، SJR، DOI، سنة النشر، نوع البحث، التعاون الدولي، عدد الاستشهادات','DOI، رابط الناشر، بيانات Scopus، بيانات Web of Science، نسخة المنشور','Institutional Publication Database',15),(16,3,16,'IND-16','قاعدة بيانات للبحوث','Institutional database for published research','compliance',4.00,'وجود قاعدة بيانات مؤسسية متكاملة للإنتاج البحثي، ترتبط بالباحث والمنشور والمشروع والمنحة والبراءة والمؤتمر والمركز البحثي والاستشهادات. يفضل ألا تكون مجرد ملفات PDF بل بيانات structured data.','الباحث، المنشور، المشروع، المنحة، البراءة، المؤتمر، المركز البحثي، الاستشهادات',NULL,'Research Repository',16),(17,3,17,'IND-17','دعم البحوث التطبيقية المرتبطة بالمجتمع وسوق العمل','Support for applied research linked to community and labor market needs','maturity',6.00,'قياس قدرة الجامعة على دعم البحوث التطبيقية المرتبطة باحتياجات المجتمع وسوق العمل الفعلية.','البحث، الباحث، المشكلة، الجهة المستفيدة، القطاع، نوع الأثر، النتائج، الاستخدام الفعلي','العقود، تقارير الأثر، مخرجات المشاريع، خطابات الجهات المستفيدة','Research Impact Module',17),(18,4,18,'IND-18','علاقات وروابط مع المؤسسات ذات العلاقة محليًا ودوليًا','Maintaining and activating relations with relevant local and international institutions','maturity',8.00,'قياس علاقات الجامعة وروابطها مع المؤسسات ذات العلاقة بتسويق نتاج البحث العلمي محليًا ودوليًا.','الباحث، البراءة، المخترع، تاريخ الإيداع، الدولة، الحالة، الجائزة، مستوى الجائزة، السنة','شهادة البراءة، شهادة الجائزة، قرار الجامعة','Innovation & IP Module',18),(19,5,19,'IND-19','تشجيع الجوائز وبراءات الاختراع','Encouraging faculty and graduates to obtain international awards or patents','quantitative',6.00,'قياس تشجيع الجامعة للحصول على براءات الاختراع والجوائز.','الباحث، البراءة، المخترع، تاريخ الإيداع، الدولة، الحالة، الجائزة، مستوى الجائزة، السنة','شهادة البراءة، شهادة الجائزة، قرار الجامعة','Innovation & IP Module',19),(20,5,20,'IND-20','سياسة الملكية الفكرية وتسويقها','Clear and fair intellectual property ownership and marketing policies','compliance',6.00,'وجود سياسة مؤسسية لإدارة الملكية الفكرية، الاختراعات، الترخيص، التسويق، والعائدات.','سياسة IP، المالك، المخترع، التقنية، الترخيص، الشركة، العائد، حالة التسويق',NULL,'IP Management System',20),(21,6,21,'IND-21','وجود معايير معلنة وموثقة لأخلاقيات البحث العلمي','Existence of published and documented scientific research ethics standards','compliance',6.00,'وجود نظام مؤسسي يضمن أن البحث يتم وفق المعايير الأخلاقية. سير العمل المقترح: الباحث → تقديم طلب أخلاقيات → مراجعة أولية → مراجعة اللجنة → موافقة/إعادة/رفض → شهادة → أرشفة.','سياسة الأخلاقيات، لجنة الأخلاقيات، أعضاء اللجنة، طلبات الموافقة، حالة الطلب، تاريخ التقديم، تاريخ الموافقة، القرار، الباحث، المشروع','السياسة، قرارات اللجنة، شهادات الموافقة','Research Ethics Workflow',21),(22,7,22,'IND-22','توفير الكتب والإصدارات الحديثة','Availability of up-to-date books and publications','quantitative',6.00,'قياس مدى توفر الكتب والدوريات وقواعد البيانات الحديثة في المكتبة.','الكتب، الدوريات، قواعد البيانات، سنة الإصدار، التخصص، عدد الموارد','سجل المكتبة، عقود الاشتراك','Library Resource Inventory',22),(23,7,23,'IND-23','دليل المكتبة','Availability of a library guide','compliance',2.00,'وجود دليل معلن لخدمات المكتبة وساعات العمل وقواعد البيانات والخدمات الإلكترونية.','دليل المكتبة، الخدمات، ساعات العمل، قواعد البيانات، الخدمات الإلكترونية، خدمات الباحثين','دليل المكتبة، صفحة الخدمات',NULL,23),(24,7,24,'IND-24','البيئة الصحية والفيزيائية للمكتبة','Health and physical environment of library halls','maturity',4.00,'قياس مدى ملاءمة البيئة الصحية والفيزيائية للمكتبة (الطاقة الاستيعابية، السلامة، الإتاحة، التجهيزات).','الطاقة الاستيعابية، السلامة، الإتاحة، التجهيزات، التفتيش، الملاحظات','تقارير التفتيش، تقارير السلامة',NULL,24),(25,7,25,'IND-25','أنظمة عالمية للتعاون مع الجامعات','Availability of global systems for collaboration with universities','quantitative',6.00,'مدى استخدام الجامعة للشبكات والأنظمة العالمية التي تسهل التعاون والوصول إلى المعلومات.','النظام، الشبكة، الشريك، الدولة، نوع الوصول، عدد المستخدمين، معدل الاستخدام','الاتفاقيات، تقارير الاستخدام',NULL,25),(26,7,26,'IND-26','تطوير النظم المكتبية','Development of library systems','maturity',6.00,'قياس تطور خدمات المكتبة وليس مجرد وجود المكتبة.','النظام الإلكتروني، الخدمات الرقمية، التحديثات، التكامل، الدعم البحثي، خطة التطوير',NULL,'Library Maturity Model',26),(27,7,27,'IND-27','المكتبات الإلكترونية وشبكات المعلومات','Equipping electronic libraries and linking them to information networks','quantitative',8.00,'مؤشرات مشتقة: Database Usage، Downloads، Active Researchers، Remote Access Rate.','قواعد البيانات، عدد المستخدمين، عمليات البحث، التنزيلات، الوصول عن بعد، ساعات الاستخدام',NULL,NULL,27),(28,7,28,'IND-28','المشاركة في التصنيفات العالمية المتعلقة بالبحث العلمي','Participation in prominent global rankings related to scientific research','quantitative',6.00,'قياس مشاركة الجامعة في التصنيفات العالمية وتتبع تغير مركزها سنويًا.','اسم التصنيف، السنة، المركز، مؤشرات التصنيف، نتيجة الجامعة، التغير السنوي',NULL,'Ranking Intelligence Module',28),(29,7,29,'IND-29','بنوك المعلومات','Establishing information banks and using modern access technologies','compliance',4.00,'وجود بنوك معلومات مؤسسية متاحة ومتكاملة للمستخدمين.','اسم قاعدة البيانات، النوع، المحتوى، المستخدمون، الوصول، التكامل، معدل الاستخدام',NULL,'Institutional Information Bank',29),(30,8,30,'IND-30','برنامج دعم التعاون مع الجامعات والشبكات البحثية العالمية','Support program for collaboration with global universities and research networks','compliance',6.00,'وجود برنامج مؤسسي داعم للتعاون مع الجامعات والشبكات البحثية العالمية.','اسم البرنامج، الباحثون، الشبكة، الشركاء، الأنشطة، النتائج، التمويل',NULL,'International Research Collaboration Program',30),(31,8,31,'IND-31','اتفاقيات استخدام أو ملكية معدات بحثية عالية الكلفة','Agreements on shared use or ownership of high-cost research equipment','quantitative',8.00,'قياس اتفاقيات مشاركة أو ملكية المعدات البحثية عالية الكلفة مع شركاء.','اسم المعدة، المالك، الجامعة، الشريك، الاتفاقية، الاستخدام، الكلفة، مدة الاتفاقية',NULL,'Shared Research Infrastructure',31),(32,8,32,'IND-32','الاتفاقيات العلمية والبحثية وتبادل الزيارات','Scientific and research agreements and visit exchanges','quantitative',6.00,'قياس عدد وفاعلية الاتفاقيات العلمية وتبادل الزيارات البحثية.','الشريك، الدولة، الباحث، الزيارة، المشروع، النشاط، المخرجات','الاتفاقية، تقارير الزيارة، صور أو مستندات النشاط عند الحاجة',NULL,32),(33,8,33,'IND-33','بروتوكولات مع مكتبات جامعات عالمية','Protocols with international university libraries','quantitative',6.00,'قياس بروتوكولات التعاون مع مكتبات جامعات عالمية.','اسم المكتبة، الجامعة، الدولة، الاتفاقية، نوع الوصول، الخدمات، الاستخدام',NULL,'International Library Access',33),(34,8,34,'IND-34','مذكرات تفاهم وشراكات بحثية','Memoranda of understanding and research partnerships','maturity',2.00,'النظام لا يقيس عدد الاتفاقيات فقط، بل يميز بين شراكة غير نشطة (اتفاقية بدون نشاط) وشراكة نشطة (اتفاقية + مشروع + باحثون + مخرج).','الشريك، الاتفاقية، النشاط، المشروع، الباحثون، المخرجات',NULL,NULL,34),(35,8,35,'IND-35','دعم التفرغ البحثي في المؤسسات العالمية','Support for research sabbaticals at international institutions','quantitative',8.00,'قياس دعم الجامعة لتفرغ الباحثين للعمل البحثي في مؤسسات عالمية.','الباحث، المؤسسة المضيفة، الدولة، مدة التفرغ، الموضوع، المخرج، المنشورات الناتجة',NULL,'Research Mobility Module',35),(36,8,36,'IND-36','تشجيع الباحثين للحصول على جوائز دولية','Encouraging researchers to obtain international awards','quantitative',6.00,'قياس تشجيع الجامعة لباحثيها للحصول على جوائز دولية.','الباحث، الجائزة، المنظمة، السنة، الترشيح، النتيجة، مستوى الجائزة','خطاب الترشيح، الشهادة، قرار الجائزة',NULL,36),(37,8,37,'IND-37','توفير ساعات بحثية للتدريسيين','Provision of dedicated research hours for faculty members','percentage',2.00,'قياس مدى توفير وقت مؤسسي لأعضاء هيئة التدريس للبحث العلمي.','عضو هيئة التدريس، الكلية، القسم، النصاب، الساعات البحثية، التخفيض، النشاط البحثي',NULL,'Academic Workload Analytics',37),(38,8,38,'IND-38','احتساب العمل البحثي ضمن النصاب التدريسي','Crediting research work within the teaching workload','compliance',4.00,'وجود لائحة تحتسب العمل البحثي ضمن النصاب التدريسي وتطبيقها فعليًا. يجب الربط مع Faculty Profile + Workload System.','اللائحة، عضو هيئة التدريس، النشاط البحثي، عدد الساعات، الساعات المحتسبة، القرار','اللائحة، جدول العبء التدريسي، القرار',NULL,38),(39,8,39,'IND-39','دعم المؤتمرات وورش العمل الإقليمية والدولية','Support for regional and international conferences and workshops','quantitative',6.00,'مؤشرات مشتقة: عدد المشاركات، عدد المشاركات الدولية، التمويل، نسبة المشاركة المدعومة.','المؤتمر، الدولة، الباحث، نوع المشاركة، البحث، التمويل، قيمة الدعم، المخرجات','شهادة المشاركة، البحث، الإيصالات، التقرير',NULL,39),(40,8,40,'IND-40','دعم العضوية في الهيئات الدولية','Support for membership in international bodies','quantitative',4.00,'قياس دعم الجامعة لعضوية باحثيها في الهيئات الدولية.','الباحث، الهيئة، الدولة، نوع العضوية، تاريخ العضوية، المنصب، الحالة','شهادة العضوية، خطاب الجهة','International Academic Membership Registry',40),(41,8,41,'IND-41','فرق البحث لخدمة قطاعات الإنتاج','Research teams serving production sectors','maturity',6.00,'ربط البحث العلمي بالقطاعات الاقتصادية والإنتاجية عبر فرق بحثية مخصصة.','فريق البحث، أعضاء الفريق، التخصصات، القطاع، المشروع، الجهة المستفيدة، التمويل، المخرجات',NULL,'Research Team Registry',41),(42,8,42,'IND-42','خطط إنشاء المراكز البحثية','Plans for establishing research centers','maturity',2.00,'حالات المشروع: مقترح ← قيد المراجعة ← معتمد ← قيد التطوير ← تشغيلي.','اسم المركز، التخصص، الحاجة، الهدف، الميزانية، الجدول الزمني، المسؤول، الحالة',NULL,'Research Center Planning Module',42),(43,8,43,'IND-43','المشاريع والأبحاث متعددة التخصصات','Interdisciplinary research projects','quantitative',6.00,'مؤشرات مشتقة: Interdisciplinary Research Rate، Number of Interdisciplinary Projects، Faculties Involved، Cross-disciplinary Publications.','المشروع، التخصصات، الباحثون، الكليات، التمويل، المنشورات، النتائج',NULL,NULL,43),(44,8,44,'IND-44','المشاريع والأبحاث المشتركة مع الشركاء الاستراتيجيين','Joint research projects with strategic partners','quantitative',6.00,'قياس الأبحاث والمشاريع التي تنفذها الجامعة مع شركاء استراتيجيين.','الشريك، الدولة، المشروع، الباحثون، التمويل، المنشورات، البراءات، الأثر، مدة المشروع','العقود، الاتفاقيات، تقارير المشروع، المنشورات، البراءات، تقارير الأثر','Strategic Research Collaboration Module',44);
/*!40000 ALTER TABLE `academic_quality_indicators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `academic_quality_standard`
--

DROP TABLE IF EXISTS `academic_quality_standard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `academic_quality_standard` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `standard_number` varchar(10) NOT NULL DEFAULT '06',
  `title_ar` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `subtitle_ar` varchar(255) DEFAULT NULL,
  `subtitle_en` varchar(255) DEFAULT NULL,
  `weight_percent` int(11) NOT NULL DEFAULT 24,
  `indicators_count` int(11) NOT NULL DEFAULT 44,
  `goals_count` int(11) NOT NULL DEFAULT 48,
  `intro_ar` text DEFAULT NULL,
  `intro_en` text DEFAULT NULL,
  `cycle_ar` text DEFAULT NULL,
  `cycle_en` text DEFAULT NULL,
  `source_note_ar` varchar(500) DEFAULT NULL,
  `source_note_en` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_quality_standard`
--

LOCK TABLES `academic_quality_standard` WRITE;
/*!40000 ALTER TABLE `academic_quality_standard` DISABLE KEYS */;
INSERT INTO `academic_quality_standard` VALUES (1,'06','معيار البحث العلمي','Scientific Research Standard','ضمن نظام الجودة الأكاديمية والاعتماد المؤسسي للجامعات العراقية','Within the academic quality and institutional accreditation system for Iraqi universities',24,44,48,'يهدف هذا المعيار إلى تحويل معيار البحث العلمي ضمن معايير الاعتماد المؤسسي للجامعات العراقية إلى نموذج رقمي قابل للبناء داخل نظام الجودة الأكاديمية. النظام لا يعمل كاستبيان نعم أو لا فقط، بل يربط بين المؤشر والبيانات والأدلة والتحقق والتقييم والدرجة والفجوة وخطة التحسين والمتابعة.','This standard aims to transform the scientific research standard within the Iraqi universities institutional accreditation standards into a digital model that can be built within the academic quality system. The system does not work as a simple yes/no questionnaire; it links the indicator with data, evidence, validation, assessment, score, gap, improvement plan, and follow-up.','النظام المقترح ليس نموذج اعتماد يُملأ مرة واحدة، بل دورة جودة مستمرة: الجامعة تُدخل البيانات وترفع الأدلة، النظام يتحقق ويحسب الأداء، يحدد نقاط القوة والفجوات، ينشئ خطة تحسين، ثم يتابع تنفيذها.','The proposed system is not a one-time accreditation form, but a continuous quality cycle: the university enters data and uploads evidence, the system validates and calculates performance, identifies strengths and gaps, creates an improvement plan, and follows up on its implementation.','المصدر المرجعي: دليل معايير الاعتماد المؤسسي لمؤسسات التعليم العالي في العراق، معيار البحث العلمي.','Reference source: Institutional Accreditation Standards Guide for Iraqi Higher Education Institutions, Scientific Research Standard.',1,'2026-08-19 18:38:52');
/*!40000 ALTER TABLE `academic_quality_standard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_log`
--

DROP TABLE IF EXISTS `activity_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_log` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `event_type` varchar(50) NOT NULL,
  `service` varchar(30) DEFAULT NULL,
  `text_ar` varchar(500) NOT NULL,
  `text_en` varchar(500) NOT NULL,
  `ref_table` varchar(60) DEFAULT NULL,
  `ref_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_activity_user_created` (`user_id`,`created_at`),
  KEY `idx_activity_type` (`event_type`),
  CONSTRAINT `fk_activity_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_log`
--

LOCK TABLES `activity_log` WRITE;
/*!40000 ALTER TABLE `activity_log` DISABLE KEYS */;
INSERT INTO `activity_log` VALUES (1,18,'settings_update','account','تم تحديث الإعدادات','Settings updated',NULL,NULL,'::1','2026-08-31 14:19:34'),(2,18,'profile_update','account','تحديث الملف الشخصي','Profile updated',NULL,NULL,'::1','2026-08-31 14:20:21'),(3,18,'avatar_update','account','تحديث الصورة الشخصية','Profile picture updated',NULL,NULL,'::1','2026-08-31 14:20:29'),(4,3,'account_approved','account','تم اعتماد الحساب','Account approved',NULL,NULL,'::1','2026-08-31 14:21:41'),(5,18,'message_reply','messages','تم إرسال رد','Reply sent','message_threads',1,'::1','2026-08-31 14:22:49'),(6,18,'task_complete','task','أكملت المهمة: ???? ???? ??????','Completed task: Complete your profile','tasks',1,'::1','2026-08-31 14:23:39'),(7,18,'research_submit','research','تقديم بحث: ?????? ????????? ?? ??????? ??????','Research submitted: ?????? ????????? ?? ??????? ??????','researches',1,'::1','2026-08-31 18:01:43'),(8,18,'research_submit','research','تقديم بحث: ?????? ????????? ?? ??????? ??????','Research submitted: ?????? ????????? ?? ??????? ??????','researches',2,'::1','2026-08-31 18:02:45'),(9,18,'review_submit','review','أنهيت تحكيم بحث: ?????? ????????? ?? ??????? ??????','Completed review: ?????? ????????? ?? ??????? ??????','reviews',1,'::1','2026-08-31 18:03:55'),(10,18,'message_reply','messages','تم إرسال رد','Reply sent','message_threads',1,'::1','2026-08-31 18:30:11'),(11,18,'review_request_submit','review','طلب تحكيم: ?????? ????????? ????????','Review request: ?????? ????????? ????????','review_requests',1,'::1','2026-08-31 19:00:16'),(12,18,'review_request_submit','review','طلب تحكيم: ?????? ????????? ????????','Review request: ?????? ????????? ????????','review_requests',2,'::1','2026-08-31 19:00:26'),(13,18,'service_request_submit','translation','طلب ترجمة جديد','New translation request','translation_requests',2,'::1','2026-09-01 16:53:21'),(14,18,'service_request_submit','proofreading','طلب تدقيق لغوي جديد','New proofreading request','proofreading_requests',2,'::1','2026-09-01 16:53:22'),(15,18,'service_request_submit','consultation','طلب استشارة جديد: How to structure my thesis','New consultation request: How to structure my thesis','consultation_requests',2,'::1','2026-09-01 16:53:22'),(16,18,'service_request_submit','journal-selection','طلب اختيار مجلة جديد','New journal selection request','journal_selection_requests',1,'::1','2026-09-01 16:53:33'),(17,18,'service_request_submit','journal-evaluation','طلب تقييم مجلة: Nature','Journal evaluation request: Nature','journal_evaluation_requests',1,'::1','2026-09-01 16:53:33'),(18,18,'service_request_submit','template','طلب قالب مجلة: IEEE Access','Template request: IEEE Access','template_requests',1,'::1','2026-09-01 16:53:33'),(19,18,'service_request_submit','correspondence','طلب مراسلة جديد','New correspondence request','correspondence_requests',1,'::1','2026-09-01 16:53:33'),(20,18,'service_request_submit','publication','طلب نشر جديد','New publication request','publication_requests',1,'::1','2026-09-01 16:53:33'),(21,32,'service_request_accept','translation','تم استلام طلب خدمة','Service request accepted','translation_requests',2,'::1','2026-09-01 16:54:49'),(22,32,'service_request_complete','translation','تم إنهاء طلب خدمة','Service request completed','translation_requests',2,'::1','2026-09-01 16:54:57'),(23,18,'service_request_submit','translation','ترجمة: العربية ← الإنجليزية','Translation: Arabic -> English','translation_requests',3,'::1','2026-09-01 17:01:03'),(24,18,'service_request_submit','correspondence','طلب مراسلة جديد','New correspondence request','correspondence_requests',2,'::1','2026-09-01 17:09:40'),(25,18,'service_request_submit','consultation','طلب استشارة جديد: Statistical Analysis ? Dr. Sara Ali','New consultation request: Statistical Analysis ? Dr. Sara Ali','consultation_requests',3,'::1','2026-09-01 17:09:47'),(26,18,'service_request_submit','journal-evaluation','طلب تقييم مجلة: IEEE Access','Journal evaluation request: IEEE Access','journal_evaluation_requests',2,'::1','2026-09-01 17:09:47'),(27,18,'service_request_submit','template','طلب قالب مجلة: Journal of Advanced Research','Template request: Journal of Advanced Research','template_requests',2,'::1','2026-09-01 17:09:47'),(28,18,'service_request_submit','journal-selection','طلب اختيار مجلة جديد','New journal selection request','journal_selection_requests',2,'::1','2026-09-01 17:09:55'),(29,18,'service_request_submit','publication','طلب نشر جديد','New publication request','publication_requests',2,'::1','2026-09-01 17:09:55'),(30,33,'account_approved','account','تم اعتماد الحساب','Account approved',NULL,NULL,'::1','2026-09-01 17:18:57'),(31,32,'service_request_accept','journal-selection','تم استلام طلب خدمة','Service request accepted','journal_selection_requests',1,'::1','2026-09-01 22:03:46'),(32,32,'service_request_accept','journal-evaluation','تم استلام طلب خدمة','Service request accepted','journal_evaluation_requests',1,'::1','2026-09-01 22:03:46'),(33,32,'service_request_accept','template','تم استلام طلب خدمة','Service request accepted','template_requests',1,'::1','2026-09-01 22:03:46'),(34,32,'service_request_accept','correspondence','تم استلام طلب خدمة','Service request accepted','correspondence_requests',1,'::1','2026-09-01 22:03:46'),(35,32,'service_request_accept','publication','تم استلام طلب خدمة','Service request accepted','publication_requests',1,'::1','2026-09-01 22:03:46'),(36,32,'service_request_accept','consultation','تم استلام طلب خدمة','Service request accepted','consultation_requests',3,'::1','2026-09-01 22:03:52'),(37,32,'service_request_complete','journal-selection','تم إنهاء طلب خدمة','Service request completed','journal_selection_requests',1,'::1','2026-09-01 22:03:57'),(38,32,'service_request_complete','journal-evaluation','تم إنهاء طلب خدمة','Service request completed','journal_evaluation_requests',1,'::1','2026-09-01 22:03:57'),(39,32,'service_request_complete','template','تم إنهاء طلب خدمة','Service request completed','template_requests',1,'::1','2026-09-01 22:03:57'),(40,32,'service_request_complete','correspondence','تم إنهاء طلب خدمة','Service request completed','correspondence_requests',1,'::1','2026-09-01 22:03:57'),(41,32,'service_request_complete','publication','تم إنهاء طلب خدمة','Service request completed','publication_requests',1,'::1','2026-09-01 22:03:57'),(42,32,'service_request_complete','consultation','تم إنهاء طلب خدمة','Service request completed','consultation_requests',3,'::1','2026-09-01 22:03:57'),(43,18,'university_profile_update','university_profile','تحديث ملف الجامعة البحثية','University research profile updated',NULL,NULL,'::1','2026-09-12 20:39:46'),(44,18,'university_profile_update','university_profile','تحديث ملف الجامعة البحثية','University research profile updated',NULL,NULL,'::1','2026-09-12 22:21:20'),(46,35,'ai_provider_settings_update','admin','تم تحديث إعدادات مزوّد الذكاء الاصطناعي: openrouter','AI provider settings updated: openrouter',NULL,NULL,'127.0.0.1','2026-09-13 15:10:42'),(47,35,'ai_provider_settings_update','admin','تم تحديث إعدادات مزوّد الذكاء الاصطناعي: openrouter','AI provider settings updated: openrouter',NULL,NULL,'127.0.0.1','2026-09-13 15:10:51'),(48,35,'ai_provider_settings_update','admin','تم تحديث إعدادات مزوّد الذكاء الاصطناعي: openrouter','AI provider settings updated: openrouter',NULL,NULL,'127.0.0.1','2026-09-14 16:55:54'),(49,5,'collaboration_request','collaborations','أرسلت طلب تعاون: ????? ???? ??? ?????? ?????????','Sent a collaboration request: ????? ???? ??? ?????? ?????????','collaborations',1,'::1','2026-09-14 17:28:01'),(50,35,'ai_provider_settings_update','admin','تم تحديث إعدادات مزوّد الذكاء الاصطناعي: openrouter','AI provider settings updated: openrouter',NULL,NULL,'::1','2026-09-14 17:28:32'),(51,5,'collaboration_request','collaborations','أرسلت طلب تعاون: تعاون بحثي حول الذكاء الاصطناعي','Sent a collaboration request: تعاون بحثي حول الذكاء الاصطناعي','collaborations',2,'::1','2026-09-14 17:28:46'),(52,35,'ai_provider_settings_update','admin','تم تحديث إعدادات مزوّد الذكاء الاصطناعي: openai','AI provider settings updated: openai',NULL,NULL,'::1','2026-09-14 17:29:42'),(53,2,'ai_assistant_chat','ai-assistant','استخدم المساعد الذكي','Used the AI assistant',NULL,NULL,'::1','2026-09-14 17:48:19'),(54,2,'ai_assistant_chat','ai-assistant','استخدم المساعد الذكي','Used the AI assistant',NULL,NULL,'::1','2026-09-14 17:49:15'),(55,2,'ai_assistant_chat','ai-assistant','استخدم المساعد الذكي','Used the AI assistant',NULL,NULL,'::1','2026-09-14 17:49:31'),(56,18,'quality_indicator_update','academic_quality','تحديث مؤشر جودة أكاديمية','Academic quality indicator updated','academic_quality_entity_responses',1,'::1','2026-09-14 18:07:10'),(57,18,'evidence_upload','academic_quality','رفع ملف دليل لمؤشر جودة','Evidence file uploaded for a quality indicator','academic_quality_evidence_files',2,'::1','2026-09-14 18:08:03'),(58,18,'university_profile_update','university_profile','تحديث ملف الجامعة البحثية','University research profile updated',NULL,NULL,'::1','2026-09-14 18:14:23'),(59,18,'university_profile_update','university_profile','تحديث ملف الجامعة البحثية','University research profile updated',NULL,NULL,'::1','2026-09-14 18:14:39'),(60,18,'university_profile_update','university_profile','تحديث ملف الجامعة البحثية','University research profile updated',NULL,NULL,'::1','2026-09-14 18:14:51'),(61,18,'university_profile_update','university_profile','تحديث ملف الجامعة البحثية','University research profile updated',NULL,NULL,'::1','2026-09-14 18:15:50'),(62,18,'university_profile_update','university_profile','تحديث ملف الجامعة البحثية','University research profile updated',NULL,NULL,'::1','2026-09-14 18:16:15'),(63,18,'university_profile_update','university_profile','تحديث ملف الجامعة البحثية','University research profile updated',NULL,NULL,'::1','2026-09-14 18:16:38'),(64,18,'university_profile_update','university_profile','تحديث ملف الجامعة البحثية','University research profile updated',NULL,NULL,'::1','2026-09-14 18:16:57'),(65,18,'ai_diagnostic_run','university_profile','تشغيل التحليل الأولي للملف البحثي بالذكاء الاصطناعي','Initial AI research profile diagnostic run','university_readiness_assessments',1,'::1','2026-09-14 18:41:58'),(66,2,'ai_assistant_chat','ai-assistant','استخدم المساعد الذكي','Used the AI assistant',NULL,NULL,'::1','2026-09-14 18:55:24'),(67,2,'ai_assistant_chat','ai-assistant','استخدم المساعد الذكي','Used the AI assistant',NULL,NULL,'::1','2026-09-14 20:01:04');
/*!40000 ALTER TABLE `activity_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ai_provider_settings`
--

DROP TABLE IF EXISTS `ai_provider_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ai_provider_settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `provider_key` varchar(30) NOT NULL,
  `is_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `api_key_encrypted` text DEFAULT NULL,
  `api_key_last4` varchar(8) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_ai_provider_key` (`provider_key`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_provider_settings`
--

LOCK TABLES `ai_provider_settings` WRITE;
/*!40000 ALTER TABLE `ai_provider_settings` DISABLE KEYS */;
INSERT INTO `ai_provider_settings` VALUES (1,'openrouter',0,'q/c9HYoIKklCN4CS:Oo49+QZqxEgYeHw6j+MU2A==:8QeuGg50KeszWPeBxwmbBXZrNycg+0iNww3DAx/7w+on0JUH4ex0ROJnr7Ehg4wDlUmnOG2ErdGBlkVQ7RcWzRFO0WlnyXa2arNa38ZMzpT0Y2awmJC3/GNqONYom52k1e/Cd3mbCxBuS2UXT7WuF3SgCT4WhsaftPb5AZ8cJ1mo3c4vt48jPHlhjHyRXiEHu/8Wc27oXm7Y5jFTGwPFAA9QqAU=','EtAA','openai/gpt-4o-mini',35,'2026-09-14 17:48:13','2026-09-13 15:05:29'),(2,'openai',1,'gmiiOHBixB3yuDV6:SXSdpGSyrup9dnAWtu2UFw==:ydQgISHthBaHgFN5yPH/cnhsXpqKpchP243zCyioJ67qVFPjHv1Bx8LCjA2eSKw2rmn2/cZw0ZuPwLzFC5sLsMjqVmlx/fchZl1/qnm5Q5gTvhYqRsqtaiz2X66fu9du3QYMjb7gcWG7rhfRa76lwt7lYFin4yyKFlHV8YSJJ1QM8svzF84mZh4vzeyaR6C9Ihdxe3Yo53EJwiD/xMp8TedenaY=','EtAA','gpt-4o-mini',35,'2026-09-14 17:29:42','2026-09-13 15:05:29');
/*!40000 ALTER TABLE `ai_provider_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collaborations`
--

DROP TABLE IF EXISTS `collaborations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `collaborations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `requester_id` bigint(20) unsigned NOT NULL,
  `recipient_id` bigint(20) unsigned NOT NULL,
  `subject` varchar(300) NOT NULL,
  `message` text DEFAULT NULL,
  `status` enum('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_requester` (`requester_id`),
  KEY `idx_recipient` (`recipient_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_collab_recipient` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_collab_requester` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collaborations`
--

LOCK TABLES `collaborations` WRITE;
/*!40000 ALTER TABLE `collaborations` DISABLE KEYS */;
/*!40000 ALTER TABLE `collaborations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultation_requests`
--

DROP TABLE IF EXISTS `consultation_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `consultation_requests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `assigned_provider_id` bigint(20) unsigned DEFAULT NULL,
  `topic` varchar(500) DEFAULT NULL,
  `preferred_datetime` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `file_size` int(10) unsigned DEFAULT NULL,
  `file_ext` varchar(10) DEFAULT NULL,
  `status` enum('pending','assigned','in_progress','completed','rejected') NOT NULL DEFAULT 'pending',
  `result_notes` text DEFAULT NULL,
  `result_file_name` varchar(255) DEFAULT NULL,
  `result_file_path` varchar(500) DEFAULT NULL,
  `result_file_size` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_cr_provider` (`assigned_provider_id`),
  KEY `idx_cr_user` (`user_id`),
  KEY `idx_cr_status` (`status`),
  CONSTRAINT `fk_cr_provider` FOREIGN KEY (`assigned_provider_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_cr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultation_requests`
--

LOCK TABLES `consultation_requests` WRITE;
/*!40000 ALTER TABLE `consultation_requests` DISABLE KEYS */;
INSERT INTO `consultation_requests` VALUES (2,18,NULL,'How to structure my thesis','2026-09-10 14:00:00','test',NULL,NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,'2026-09-01 16:53:22','2026-09-01 16:53:22'),(3,18,32,'Statistical Analysis ? Dr. Sara Ali',NULL,'How do I run a regression in SPSS?',NULL,NULL,NULL,NULL,'completed','Test result for consultation',NULL,NULL,NULL,'2026-09-01 17:09:47','2026-09-01 22:03:57');
/*!40000 ALTER TABLE `consultation_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
INSERT INTO `contact_messages` VALUES (1,'dfhbgfh','ghfgh@sfgdh.fjfj','gfhfg','gfnfgn fhdgh herth ',0,'2026-08-13 03:40:01');
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `correspondence_requests`
--

DROP TABLE IF EXISTS `correspondence_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `correspondence_requests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `assigned_provider_id` bigint(20) unsigned DEFAULT NULL,
  `correspondence_type` enum('cover_letter','response_to_reviewers','withdrawal','revision','inquiry','general') NOT NULL DEFAULT 'general',
  `notes` text DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `file_size` int(10) unsigned DEFAULT NULL,
  `file_ext` varchar(10) DEFAULT NULL,
  `status` enum('pending','assigned','in_progress','completed','rejected') NOT NULL DEFAULT 'pending',
  `result_notes` text DEFAULT NULL,
  `result_file_name` varchar(255) DEFAULT NULL,
  `result_file_path` varchar(500) DEFAULT NULL,
  `result_file_size` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_cor_provider` (`assigned_provider_id`),
  KEY `idx_cor_user` (`user_id`),
  KEY `idx_cor_status` (`status`),
  CONSTRAINT `fk_cor_provider` FOREIGN KEY (`assigned_provider_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_cor_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `correspondence_requests`
--

LOCK TABLES `correspondence_requests` WRITE;
/*!40000 ALTER TABLE `correspondence_requests` DISABLE KEYS */;
INSERT INTO `correspondence_requests` VALUES (1,18,32,'cover_letter','test','sample_cv.pdf','uploads/service_results/correspondence_18_1788281613_sample_cv.pdf',37,'pdf','completed','Test result for correspondence',NULL,NULL,NULL,'2026-09-01 16:53:33','2026-09-01 22:03:57'),(2,18,NULL,'revision','Dear Editor, please find revised manuscript attached.',NULL,NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,'2026-09-01 17:09:40','2026-09-01 17:09:40');
/*!40000 ALTER TABLE `correspondence_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_verifications`
--

DROP TABLE IF EXISTS `email_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `email_verifications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `token` varchar(64) NOT NULL COMMENT 'رمز التحقق المشفر',
  `type` enum('registration','reset') NOT NULL DEFAULT 'registration',
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_token` (`token`),
  KEY `idx_user_type` (`user_id`,`type`),
  KEY `idx_expires` (`expires_at`),
  CONSTRAINT `fk_verification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='أكواد التحقق من البريد الإلكتروني';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_verifications`
--

LOCK TABLES `email_verifications` WRITE;
/*!40000 ALTER TABLE `email_verifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faqs`
--

DROP TABLE IF EXISTS `faqs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `faqs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_ar` varchar(255) NOT NULL,
  `question_en` varchar(255) NOT NULL,
  `answer_ar` text NOT NULL,
  `answer_en` text NOT NULL,
  `sort_order` int(11) DEFAULT 50,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faqs`
--

LOCK TABLES `faqs` WRITE;
/*!40000 ALTER TABLE `faqs` DISABLE KEYS */;
INSERT INTO `faqs` VALUES (1,'كيف يمكنني التسجيل في المنصة؟','How can I register on the platform?','يمكنك التسجيل بسهولة عبر الضغط على زر \"إنشاء حساب\" في أعلى الصفحة، ثم ملء بياناتك الأكاديمية والشخصية وإتمام خطوات التحقق.','You can easily register by clicking the \"Create Account\" button at the top of the page, then filling out your academic and personal information and completing the verification steps.',1,1),(2,'كيف أرسل بحثي للنشر؟','How do I submit my research for publication?','بعد تسجيل الدخول، اذهب إلى صفحة الخدمات واختر \"خدمات النشر\"، واتبع الخطوات لرفع ملف البحث بصيغة PDF أو Word مع إرفاق الملخص.','After logging in, go to the Services page and select \"Publishing Services\", then follow the steps to upload your research file in PDF or Word format along with the abstract.',2,1),(3,'هل المنصة مجانية؟','Is the platform free?','نعم، جميع الخدمات المقدمة عبر منصة البحث العلمي مجانية بالكامل للباحثين والمؤسسات الأكاديمية الحكومية والخاصة.','Yes, all services provided through the scientific research platform are completely free for researchers and public and private academic institutions.',3,1),(4,'كيف أتواصل مع الدعم الفني؟','How do I contact technical support?','يمكنك زيارة صفحة \"التواصل معنا\" وإرسال استفسارك، وسنرد عليك خلال 24 ساعة عمل. كما يمكنك التواصل عبر البريد الإلكتروني المباشر.','You can visit the \"Contact Us\" page and submit your inquiry, and we will respond to you within 24 business hours. You can also communicate via direct email.',4,1),(5,'كيف يمكنني تعديل بياناتي الشخصية؟','How can I edit my personal information?','بعد تسجيل الدخول، انتقل إلى الإعدادات الشخصية من خلال النقر على صورة ملفك الشخصي، وقم بتحديث البيانات المطلوبة ثم احفظ التغييرات.','After logging in, go to personal settings by clicking on your profile picture, update the required data, then save the changes.',5,1);
/*!40000 ALTER TABLE `faqs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `home_slides`
--

DROP TABLE IF EXISTS `home_slides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `home_slides` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image_url` varchar(500) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `home_slides`
--

LOCK TABLES `home_slides` WRITE;
/*!40000 ALTER TABLE `home_slides` DISABLE KEYS */;
INSERT INTO `home_slides` VALUES (9,'/Home/anim/lab.svg',0,1,'2026-09-16 15:15:02','2026-09-16 15:15:02'),(10,'/Home/anim/molecules.svg',1,1,'2026-09-16 15:15:02','2026-09-16 15:15:02'),(11,'/Home/anim/office.svg',2,1,'2026-09-16 15:15:02','2026-09-16 15:15:02');
/*!40000 ALTER TABLE `home_slides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `institutions`
--

DROP TABLE IF EXISTS `institutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `institutions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name_ar` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `type` enum('university','research_center','ministry') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institutions`
--

LOCK TABLES `institutions` WRITE;
/*!40000 ALTER TABLE `institutions` DISABLE KEYS */;
INSERT INTO `institutions` VALUES (1,'جامعة الملك سعود','King Saud University','university','2026-07-26 03:59:08');
/*!40000 ALTER TABLE `institutions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `journal_evaluation_requests`
--

DROP TABLE IF EXISTS `journal_evaluation_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `journal_evaluation_requests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `assigned_provider_id` bigint(20) unsigned DEFAULT NULL,
  `journal_name` varchar(500) NOT NULL,
  `journal_issn` varchar(50) DEFAULT NULL,
  `journal_link` varchar(500) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('pending','assigned','in_progress','completed','rejected') NOT NULL DEFAULT 'pending',
  `result_notes` text DEFAULT NULL,
  `result_file_name` varchar(255) DEFAULT NULL,
  `result_file_path` varchar(500) DEFAULT NULL,
  `result_file_size` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_jer_provider` (`assigned_provider_id`),
  KEY `idx_jer_user` (`user_id`),
  KEY `idx_jer_status` (`status`),
  CONSTRAINT `fk_jer_provider` FOREIGN KEY (`assigned_provider_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_jer_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_evaluation_requests`
--

LOCK TABLES `journal_evaluation_requests` WRITE;
/*!40000 ALTER TABLE `journal_evaluation_requests` DISABLE KEYS */;
INSERT INTO `journal_evaluation_requests` VALUES (1,18,32,'Nature','1234-5678','https://nature.com','test','completed','Test result for journal-evaluation',NULL,NULL,NULL,'2026-09-01 16:53:33','2026-09-01 22:03:57'),(2,18,NULL,'IEEE Access','2169-3536','https://ieeeaccess.ieee.org','','pending',NULL,NULL,NULL,NULL,'2026-09-01 17:09:47','2026-09-01 17:09:47');
/*!40000 ALTER TABLE `journal_evaluation_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `journal_selection_requests`
--

DROP TABLE IF EXISTS `journal_selection_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `journal_selection_requests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `assigned_provider_id` bigint(20) unsigned DEFAULT NULL,
  `research_field` varchar(255) DEFAULT NULL,
  `priority` enum('impact','speed','open_access','no_preference') DEFAULT 'no_preference',
  `notes` text DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `file_size` int(10) unsigned DEFAULT NULL,
  `file_ext` varchar(10) DEFAULT NULL,
  `status` enum('pending','assigned','in_progress','completed','rejected') NOT NULL DEFAULT 'pending',
  `result_notes` text DEFAULT NULL,
  `result_file_name` varchar(255) DEFAULT NULL,
  `result_file_path` varchar(500) DEFAULT NULL,
  `result_file_size` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_jsr_provider` (`assigned_provider_id`),
  KEY `idx_jsr_user` (`user_id`),
  KEY `idx_jsr_status` (`status`),
  CONSTRAINT `fk_jsr_provider` FOREIGN KEY (`assigned_provider_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_jsr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_selection_requests`
--

LOCK TABLES `journal_selection_requests` WRITE;
/*!40000 ALTER TABLE `journal_selection_requests` DISABLE KEYS */;
INSERT INTO `journal_selection_requests` VALUES (1,18,32,'Computer Science','impact','test','sample_cv.pdf','uploads/service_results/journal_selection_18_1788281613_sample_cv.pdf',37,'pdf','completed','Test result for journal-selection',NULL,NULL,NULL,'2026-09-01 16:53:33','2026-09-01 22:03:57'),(2,18,NULL,'Computer Science','open_access','','sample_cv.pdf','uploads/service_results/journal_selection_18_1788282595_sample_cv.pdf',37,'pdf','pending',NULL,NULL,NULL,NULL,'2026-09-01 17:09:55','2026-09-01 17:09:55');
/*!40000 ALTER TABLE `journal_selection_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message_threads`
--

DROP TABLE IF EXISTS `message_threads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `message_threads` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `subject_ar` varchar(300) NOT NULL,
  `subject_en` varchar(300) NOT NULL,
  `sender_type` enum('system','admin','employee','user') NOT NULL DEFAULT 'system',
  `sender_id` bigint(20) unsigned DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `last_message_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_thread_sender` (`sender_id`),
  KEY `idx_thread_user_read` (`user_id`,`is_read`),
  CONSTRAINT `fk_thread_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_thread_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message_threads`
--

LOCK TABLES `message_threads` WRITE;
/*!40000 ALTER TABLE `message_threads` DISABLE KEYS */;
INSERT INTO `message_threads` VALUES (1,18,'?????? ?? ?? ??????','Welcome to the platform','system',NULL,1,'2026-08-31 18:30:11','2026-08-31 14:22:49');
/*!40000 ALTER TABLE `message_threads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `thread_id` bigint(20) unsigned NOT NULL,
  `sender_type` enum('system','admin','employee','user') NOT NULL,
  `sender_id` bigint(20) unsigned DEFAULT NULL,
  `body` text NOT NULL,
  `attachment_path` varchar(500) DEFAULT NULL,
  `attachment_name` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_msg_sender` (`sender_id`),
  KEY `idx_msg_thread_created` (`thread_id`,`created_at`),
  CONSTRAINT `fk_msg_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_msg_thread` FOREIGN KEY (`thread_id`) REFERENCES `message_threads` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,1,'system',NULL,'?????? ??? ????? ???? ???? ?????????.',NULL,NULL,0,'2026-08-31 14:22:49'),(2,1,'user',18,'????? ???',NULL,NULL,1,'2026-08-31 14:22:49'),(3,1,'user',18,'مرحبا',NULL,NULL,1,'2026-08-31 18:30:11');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title_ar` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `content_ar` text DEFAULT NULL,
  `content_en` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `category` enum('updates','grants','events','announcements') NOT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  `published_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (1,'إطلاق النسخة الجديدة من معايير التصنيف العلمي','Launching New Scientific Classification Standards',NULL,NULL,'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?q=80&w=2070&auto=format&fit=crop','new-classification-standards','updates',1,'2026-07-26 15:23:34','2026-07-26 15:27:09'),(2,'تمويل 50 مشروعاً بحثياً في مجال الذكاء الاصطناعي','Funding 50 AI Research Projects',NULL,NULL,'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1964&auto=format&fit=crop','funding-ai-projects','grants',1,'2026-07-26 15:23:34','2026-07-26 15:27:09'),(3,'نتائج الملتقى السنوي للبحث العلمي','Annual Research Forum Results',NULL,NULL,'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop','annual-forum-results','events',1,'2026-07-26 15:23:34','2026-07-26 15:27:09'),(6,'نتائج الملتقى السنوي للبحث العلمي','Annual Research Forum Results2',NULL,NULL,'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop','annual-forum-results2','events',1,'2026-07-26 15:23:34','2026-07-26 15:27:09');
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title_ar` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content_ar` longtext DEFAULT NULL,
  `content_en` longtext DEFAULT NULL,
  `icon_name` varchar(100) DEFAULT 'FileText',
  `color_class` varchar(255) DEFAULT 'from-blue-600 to-indigo-700',
  `sort_order` int(11) DEFAULT 50,
  `is_active` tinyint(1) DEFAULT 1,
  `show_in_nav` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` VALUES (1,'نظرة عامة','Overview','overview','<p>محتوى نظرة عامة باللغة العربية يوضح هدف المنصة ورؤيتها.</p>','<p>English content for Overview page explaining the platform goal and vision.</p>','Eye','from-[#0a1628] to-[#1a2744]',1,1,1),(2,'الفئة المستهدفة','Target Audience','target-audience','<p>محتوى الفئة المستهدفة: الباحثون، الطلاب، الأكاديميون...</p>','<p>Target Audience Content: Researchers, Students, Academics...</p>','Users','from-[#0a1628] to-[#1a2744]',2,1,1),(3,'شروط النشر','Publishing Terms','publishing-terms','<p>شروط وأحكام نشر الأبحاث العلمية في المنصة...</p>','<p>Terms and conditions for publishing scientific research on the platform...</p>','FileText','from-[#0a1628] to-[#1a2744]',3,1,1),(4,'عن المنصة','About Us','about-us','<p>معلومات تفصيلية عن منصة البحث العلمي وتاريخها...</p>','<p>Detailed information about the Scientific Research Platform and its history...</p>','Building2','from-[#0a1628] to-[#1a2744]',4,1,1),(5,'الشروط والأحكام','Terms & Conditions','terms','<p>الشروط القانونية العامة لاستخدام الموقع...</p>','<p>General legal terms for using the website...</p>','Scale','from-[#0a1628] to-[#1a2744]',5,1,1),(6,'سياسة الخصوصية','Privacy Policy','policy','<p>كيفية تعاملنا مع بياناتك وخصوصيتك...</p>','<p>How we handle your data and your privacy...</p>','Shield','from-[#0a1628] to-[#1a2744]',6,1,1);
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platform_services`
--

DROP TABLE IF EXISTS `platform_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `platform_services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `icon_name` varchar(50) NOT NULL,
  `title_ar` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `desc_ar` text NOT NULL,
  `desc_en` text NOT NULL,
  `details_ar` text DEFAULT NULL,
  `details_en` text DEFAULT NULL,
  `link` varchar(255) DEFAULT '/#',
  `slug` varchar(255) DEFAULT NULL,
  `color_class` varchar(100) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platform_services`
--

LOCK TABLES `platform_services` WRITE;
/*!40000 ALTER TABLE `platform_services` DISABLE KEYS */;
INSERT INTO `platform_services` VALUES (1,'BookOpen','تقديم بحث','Submit Research','ارفع أبحاثك ومقالاتك العلمية للمراجعة والنشر في المجلات المعتمدة.','Upload your scientific research and articles for review and publication.','<p>تتيح لك منصة البحث العلمي تقديم أبحاثك ومقالاتك العلمية بسهولة ويسر. يتم استقبال البحث ثم توجيهه تلقائياً لإدارة المنصة لبدء رحلة المعالجة.</p><ul class=\"list-disc pl-5 mt-4 space-y-2\"><li>رفع ملف البحث بصيغة PDF أو Word.</li><li>إدخال بيانات البحث الأساسية (العنوان، الملخص، الكلمات المفتاحية).</li><li>متابعة حالة البحث خطوة بخطوة.</li></ul>','<p>The platform allows you to submit your research and scientific articles easily. The research is received and automatically directed to platform management to begin processing.</p><ul class=\"list-disc pl-5 mt-4 space-y-2\"><li>Upload research file in PDF or Word format.</li><li>Enter basic research data (Title, Abstract, Keywords).</li><li>Track research status step by step.</li></ul>','/submit','submit-research','from-[#0a1628] to-[#1a2744]',1,1),(2,'TrendingUp','تتبع الطلبات','Track Status','تابع حالة طلباتك ومعرفة المرحلة التي وصل إليها بحثك بكل شفافية.','Follow the status of your requests and know the stage your research has reached.','<p>لا تقلق بعد تقديم بحثك، يمكنك الآن متابعة حالة طلبك في أي وقت ومن أي مكان من خلال لوحة التتبع.</p><p class=\"mt-3 font-bold\">مراحل تتبع البحث:</p><ol class=\"list-decimal pl-5 mt-2 space-y-1\"><li>قيد المراجعة الأولية.</li><li>فحص الانتحال.</li><li>الترجمة والتدقيق.</li><li>التحكيم العلمي.</li><li>القبول والنشر.</li></ol>','<p>Do not worry after submitting your research, you can now follow your request status anytime and anywhere through the tracking panel.</p>','/tracking','track-status','from-green-500 to-green-600',2,1),(3,'HandCoins','المنح والتمويل','Grants & Funding','تقدم بطلب للحصول على منح بحثية لدعم مشاريعك العلمية المبتكرة.','Apply for research grants to support your innovative scientific projects.','<p>توفر المنصة فرص تمويل بحثية متميزة لدعم المشاريع العلمية المبتكرة التي تساهم في تطوير المجتمع.</p>','<p>The platform provides distinguished research funding opportunities to support innovative scientific projects that contribute to community development.</p>','/funding','funding','from-[#0a1628] to-[#1a2744]',3,1),(4,'FlaskConical','التعاون البحثي','Research Collaboration','ابحث عن فرص للتعاون مع باحثين ومؤسسات من مختلف جامعات المملكة.','Find opportunities to collaborate with researchers and institutions from various universities.','<p>وسّع دائرة أبحاثك من خلال التواصل مع باحثين ومؤسسات أكاديمية مختلفة لتبادل الخبرات والعمل على مشاريع مشتركة.</p>','<p>Expand your research circle by connecting with different researchers and academic institutions to exchange expertise and work on joint projects.</p>','/collaborate','research-collaboration','from-orange-500 to-orange-600',4,1),(5,'Award','الجودة الأكاديمية','Academic Quality','تقييم ومتابعة جودة البحث العلمي في الجامعات وفق معايير الاعتماد المؤسسي العراقي.','Evaluating and monitoring scientific research quality at universities according to the Iraqi institutional accreditation standards.','خدمة الجودة الأكاديمية مبنية على \"معيار البحث العلمي\" (المعيار السادس) ضمن دليل معايير الاعتماد المؤسسي لمؤسسات التعليم العالي في العراق، ويمثل هذا المعيار 24% من درجة الاعتماد المؤسسي ويضم 44 مؤشرًا موزعة على 8 عناصر رئيسية:\n\n1. بيئة البحث العلمي\n2. تمويل البحث العلمي\n3. نشر البحث العلمي\n4. تسويق البحث العلمي\n5. الإبداع والابتكار\n6. أخلاقيات البحث العلمي\n7. مصادر المعلومات\n8. التعاون الدولي في الأنشطة العلمية والبحثية\n\nتتيح الخدمة للجامعة إدخال بياناتها وأدلتها لكل مؤشر، ليقوم النظام بالتحقق من البيانات وتقييمها (غير متحقق / جزئي / كلي) واحتساب درجة كل عنصر ثم درجة المعيار ككل، وتحديد الفجوات، واقتراح خطة تحسين ومتابعة تنفيذها — بما يجعل قياس جودة البحث العلمي جزءًا من دورة جودة مؤسسية مستمرة وليس تقييمًا يُملأ مرة واحدة.\n\nالمصدر المرجعي: دليل معايير الاعتماد المؤسسي لمؤسسات التعليم العالي في العراق، معيار البحث العلمي.','The Academic Quality service is based on the \"Scientific Research Standard\" (Standard 6) within the Iraqi institutional accreditation guide for higher education institutions. This standard represents 24% of the institutional accreditation score and includes 44 indicators across 8 main elements:\n\n1. Research Environment\n2. Research Funding\n3. Research Publishing\n4. Research Marketing\n5. Creativity and Innovation\n6. Research Ethics\n7. Information Resources\n8. International Collaboration in Scientific Activities\n\nThe service allows the university to enter its data and evidence for each indicator, and the system verifies and assesses the data (not met / partial / fully met), calculates the score for each element and the overall standard score, identifies gaps, and proposes an improvement plan with follow-up tracking — making research quality measurement part of a continuous institutional quality cycle rather than a one-time evaluation.\n\nReference source: Institutional Accreditation Standards Guide for Iraqi Higher Education Institutions, Scientific Research Standard.','/login','academic-quality','from-purple-500 to-purple-600',5,1),(6,'Microscope','الخدمات العلمية','Scientific Services','مجموعة من الخدمات العلمية والبحثية المقدمة للباحثين والمؤسسات الأكاديمية.','A set of scientific and research services provided to researchers and academic institutions.','تجمع هذه الخدمة مجموعة من الخدمات العلمية المساندة للباحثين والمؤسسات الأكاديمية. سيتم تحديد تفاصيلها لاحقًا.','This service brings together a set of scientific support services for researchers and academic institutions. Details to be finalized later.','/#','scientific-services','from-blue-500 to-blue-600',6,1);
/*!40000 ALTER TABLE `platform_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles_entity`
--

DROP TABLE IF EXISTS `profiles_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profiles_entity` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `entity_name` varchar(300) NOT NULL COMMENT 'اسم الكيان',
  `entity_type` enum('gov','private','international') NOT NULL COMMENT 'نوع الكيان',
  `parent_university_id` int(11) DEFAULT NULL,
  `website` varchar(500) DEFAULT NULL COMMENT 'الموقع الإلكتروني',
  `official_email` varchar(191) DEFAULT NULL COMMENT 'البريد الرسمي',
  `phone` varchar(30) DEFAULT NULL,
  `address` text DEFAULT NULL COMMENT 'العنوان',
  `director_name` varchar(200) DEFAULT NULL COMMENT 'اسم المدير',
  `position` varchar(200) DEFAULT NULL COMMENT 'المنصب',
  `director_phone` varchar(30) DEFAULT NULL COMMENT 'هاتف المدير',
  `director_email` varchar(191) DEFAULT NULL COMMENT 'بريد المدير',
  `additional_notes` text DEFAULT NULL COMMENT 'ملاحظات إضافية',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `avatar_path` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_entity_type` (`entity_type`),
  KEY `idx_entity_name` (`entity_name`(100)),
  KEY `idx_profiles_entity_parent_university` (`parent_university_id`),
  CONSTRAINT `fk_entity_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ملف الكيانات (جامعة، كلية، مركز بحثي، وزارة) - جدول موحد';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles_entity`
--

LOCK TABLES `profiles_entity` WRITE;
/*!40000 ALTER TABLE `profiles_entity` DISABLE KEYS */;
INSERT INTO `profiles_entity` VALUES (1,6,'vnhmghm','gov',NULL,'https://osama.com','a5@a.a','123','gnfgj','gnfhjghgkh','gghkghk','123','a6@a.a','cgnmghkmgjk','2026-08-12 21:22:46','2026-08-12 21:22:46',NULL),(2,14,'xfbdgn','private',NULL,'https://os.com','xyz@xyz.xyz','fhdh','dgnfgj','bngfjn','ghfgj','7992','xyz@xyz.xyzaa','xfngfj','2026-08-13 03:02:53','2026-08-13 03:02:53',NULL),(3,18,'جامعة تجريبية','gov',NULL,NULL,'info@testuni.edu.iq','07701234567',NULL,NULL,NULL,NULL,NULL,NULL,'2026-08-19 19:34:20','2026-09-14 17:13:54','uploads/avatars/avatar_18_1788186029.jpg'),(4,26,'Test University','gov',NULL,NULL,NULL,'7700000005',NULL,NULL,NULL,NULL,NULL,NULL,'2026-09-01 16:49:26','2026-09-01 16:49:26',NULL),(5,27,'Test College','gov',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-09-01 16:49:26','2026-09-01 16:49:26',NULL),(6,28,'Test Research Center','gov',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-09-01 16:49:26','2026-09-01 16:49:26',NULL),(7,29,'Test Ministry','gov',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-09-01 16:49:26','2026-09-01 16:49:26',NULL);
/*!40000 ALTER TABLE `profiles_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles_faculty`
--

DROP TABLE IF EXISTS `profiles_faculty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profiles_faculty` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `name` varchar(200) NOT NULL COMMENT 'الاسم',
  `academic_rank` enum('asst_lecturer','lecturer','asst_prof','assoc_prof','prof') DEFAULT NULL COMMENT 'الرتبة الأكاديمية: مدرس مساعد، مدرس، أستاذ مساعد، أستاذ مشارك، أستاذ',
  `university` varchar(200) DEFAULT NULL COMMENT 'الجامعة',
  `college` varchar(200) DEFAULT NULL COMMENT 'الكلية',
  `department` varchar(200) DEFAULT NULL COMMENT 'القسم',
  `uni_email` varchar(191) DEFAULT NULL COMMENT 'البريد الجامعي',
  `phone` varchar(30) DEFAULT NULL COMMENT 'رقم الهاتف',
  `orcid` varchar(19) DEFAULT NULL COMMENT 'رقم ORCID',
  `scopus_id` varchar(30) DEFAULT NULL COMMENT 'معرف Scopus',
  `scholar` varchar(100) DEFAULT NULL COMMENT 'رابط Google Scholar',
  `research_interests` text DEFAULT NULL COMMENT 'اهتمامات بحثية',
  `published_papers` int(10) unsigned DEFAULT 0 COMMENT 'عدد الأوراق المنشورة',
  `books` int(10) unsigned DEFAULT 0 COMMENT 'عدد الكتب',
  `patents` int(10) unsigned DEFAULT 0 COMMENT 'عدد براءات الاختراع',
  `research_projects` int(10) unsigned DEFAULT 0 COMMENT 'عدد المشاريع البحثية',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `avatar_path` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_academic_rank` (`academic_rank`),
  KEY `idx_orcid` (`orcid`),
  KEY `idx_scopus_id` (`scopus_id`),
  CONSTRAINT `fk_faculty_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ملف عضو هيئة التدريس';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles_faculty`
--

LOCK TABLES `profiles_faculty` WRITE;
/*!40000 ALTER TABLE `profiles_faculty` DISABLE KEYS */;
INSERT INTO `profiles_faculty` VALUES (1,4,'qqqq','asst_lecturer','1','3','gnfhj','a2@a.a','111','123','123','dfhfgh','nhmghm',1,2,3,4,'2026-08-12 21:20:55','2026-08-12 21:20:55',NULL),(2,16,'suhaib','asst_lecturer','1','1','it','suhaib@gmail.com','592679732','120651000','21202151502','https://ris.sibaljo.com/','aksjvansvasiv',5,5,5,4,'2026-08-17 13:35:04','2026-08-17 13:35:04',NULL),(3,23,'Test Faculty',NULL,NULL,NULL,NULL,NULL,'7700000003',NULL,NULL,NULL,NULL,0,0,0,0,'2026-09-01 16:49:17','2026-09-01 16:49:17',NULL);
/*!40000 ALTER TABLE `profiles_faculty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles_grad`
--

DROP TABLE IF EXISTS `profiles_grad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profiles_grad` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `full_name` varchar(200) NOT NULL,
  `uni_id` varchar(50) DEFAULT NULL,
  `uni_email` varchar(191) DEFAULT NULL,
  `personal_email` varchar(191) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `gender` enum('male','female') DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `university` varchar(200) DEFAULT NULL,
  `college` varchar(200) DEFAULT NULL,
  `department` varchar(200) DEFAULT NULL,
  `degree` enum('master','phd') DEFAULT NULL COMMENT 'الدرجة العلمية',
  `thesis_title` text DEFAULT NULL COMMENT 'عنوان الرسالة',
  `supervisor` varchar(200) DEFAULT NULL COMMENT 'مشرف الرسالة',
  `co_supervisor` varchar(200) DEFAULT NULL COMMENT 'مشرف مشارك',
  `orcid` varchar(19) DEFAULT NULL COMMENT 'رقم ORCID',
  `scholar` varchar(100) DEFAULT NULL COMMENT 'رابط Google Scholar',
  `scopus_id` varchar(30) DEFAULT NULL COMMENT 'معرف Scopus',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `avatar_path` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_orcid` (`orcid`),
  KEY `idx_scopus_id` (`scopus_id`),
  CONSTRAINT `fk_grad_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ملف طالب الدراسات العليا';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles_grad`
--

LOCK TABLES `profiles_grad` WRITE;
/*!40000 ALTER TABLE `profiles_grad` DISABLE KEYS */;
INSERT INTO `profiles_grad` VALUES (1,3,'1','1111','a@a.a','a1@a.a','123','male','2026-08-13','1','1','11','master','fghjfgjfj','gnfghjfj','ghfjghj','1234','xfgdhfgh','ghfj','2026-08-12 21:19:41','2026-08-12 21:19:41',NULL),(2,12,'يفايبا','1','qwe@qwe.qwe','qwe@qwe.qwe','111','male','2026-08-13','1','2','qq','master','cnfj','dghfgj','gfhjgh','ghfj','fgnfhj','fgjhj','2026-08-13 02:59:29','2026-08-13 02:59:29',NULL),(3,15,'aaaa','123','test@gmail.com','test@gmail.com','123','male','2026-07-30','1','1','1','master','dfdfh','dhdfh','ghfg','gbfgn','gnfn','ghfg','2026-08-13 03:37:10','2026-08-13 03:37:10',NULL),(4,20,'صهيب','200005123','suhaib@aba.ps','suhaib@aba.ps','592679732','male','2001-06-30','1','1','هندسة حاسوب','master',NULL,NULL,NULL,NULL,NULL,NULL,'2026-08-31 18:47:48','2026-08-31 18:47:48',NULL),(5,22,'Test Grad',NULL,NULL,NULL,'7700000002',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-09-01 16:49:17','2026-09-01 16:49:17',NULL);
/*!40000 ALTER TABLE `profiles_grad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles_researcher`
--

DROP TABLE IF EXISTS `profiles_researcher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profiles_researcher` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `full_name` varchar(200) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `institution` varchar(200) DEFAULT NULL COMMENT 'المؤسسة',
  `department` varchar(200) DEFAULT NULL,
  `major` varchar(200) DEFAULT NULL COMMENT 'التخصص',
  `orcid` varchar(19) DEFAULT NULL,
  `scopus_id` varchar(30) DEFAULT NULL,
  `scholar` varchar(100) DEFAULT NULL,
  `research_interests` text DEFAULT NULL,
  `published_papers` int(10) unsigned DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `avatar_path` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_orcid` (`orcid`),
  CONSTRAINT `fk_researcher_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ملف الباحث المستقل';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles_researcher`
--

LOCK TABLES `profiles_researcher` WRITE;
/*!40000 ALTER TABLE `profiles_researcher` DISABLE KEYS */;
INSERT INTO `profiles_researcher` VALUES (1,5,'1','a3@a.a','123','fgfnn','fgnh','dghfgh','cgnfnfh','gnfh','cgnf','bnvbm',2,'2026-08-12 21:21:42','2026-08-12 21:21:42',NULL),(2,24,'Test Researcher',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2026-09-01 16:49:17','2026-09-01 16:49:17',NULL);
/*!40000 ALTER TABLE `profiles_researcher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles_reviewer`
--

DROP TABLE IF EXISTS `profiles_reviewer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profiles_reviewer` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `full_name` varchar(200) NOT NULL,
  `degree` enum('master','phd','prof') DEFAULT NULL COMMENT 'الدرجة العلمية',
  `institution` varchar(200) DEFAULT NULL,
  `major` varchar(200) DEFAULT NULL COMMENT 'التخصص العام',
  `specific_major` varchar(200) DEFAULT NULL COMMENT 'التخصص الدقيق',
  `email` varchar(191) DEFAULT NULL,
  `orcid` varchar(19) DEFAULT NULL,
  `scopus_id` varchar(30) DEFAULT NULL,
  `review_fields` text DEFAULT NULL COMMENT 'مجالات التحكيم',
  `review_count` int(10) unsigned DEFAULT 0 COMMENT 'عدد التحكيمات',
  `languages` varchar(200) DEFAULT NULL COMMENT 'اللغات',
  `short_cv` text DEFAULT NULL COMMENT 'سيرة ذاتية مختصرة',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `avatar_path` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_degree` (`degree`),
  KEY `idx_orcid` (`orcid`),
  CONSTRAINT `fk_reviewer_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ملف المحكم';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles_reviewer`
--

LOCK TABLES `profiles_reviewer` WRITE;
/*!40000 ALTER TABLE `profiles_reviewer` DISABLE KEYS */;
INSERT INTO `profiles_reviewer` VALUES (1,25,'Test Reviewer',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,'2026-09-01 16:49:26','2026-09-01 16:49:26',NULL);
/*!40000 ALTER TABLE `profiles_reviewer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles_service_provider`
--

DROP TABLE IF EXISTS `profiles_service_provider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profiles_service_provider` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `qualifications` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `cv_file_name` varchar(255) DEFAULT NULL,
  `cv_file_path` varchar(500) DEFAULT NULL,
  `cv_file_size` int(10) unsigned DEFAULT NULL,
  `avatar_path` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_sp_user` (`user_id`),
  CONSTRAINT `fk_sp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles_service_provider`
--

LOCK TABLES `profiles_service_provider` WRITE;
/*!40000 ALTER TABLE `profiles_service_provider` DISABLE KEYS */;
INSERT INTO `profiles_service_provider` VALUES (1,32,'Test Provider','7701234567',NULL,'MA in Translation','5 years experience','sample_cv.pdf','uploads/cvs/cv_32_1788281404_sample_cv.pdf',37,NULL,'2026-09-01 16:50:04','2026-09-01 16:50:04'),(2,33,'براوزر تست','7709998877','browser-sp-test-4529@ris.local','PhD in Linguistics','10 years experience','sample_cv.pdf','uploads/cvs/cv_33_1788283086_sample_cv.pdf',37,NULL,'2026-09-01 17:18:06','2026-09-01 17:18:06');
/*!40000 ALTER TABLE `profiles_service_provider` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles_system`
--

DROP TABLE IF EXISTS `profiles_system`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profiles_system` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `job_title` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `avatar_path` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles_system`
--

LOCK TABLES `profiles_system` WRITE;
/*!40000 ALTER TABLE `profiles_system` DISABLE KEYS */;
INSERT INTO `profiles_system` VALUES (1,11,'Osama Alkhoun','Administrator','IT','osamamalkhoun@gmail.com','796484613','2026-08-13 01:43:17','2026-08-13 01:43:17',NULL),(2,17,'Afnan Momani','Manager','Administration','afnan@gmail.com','9629874563210','2026-08-17 13:56:37','2026-08-17 13:56:37',NULL),(3,30,'Test Employee',NULL,NULL,'',NULL,'2026-09-01 16:49:26','2026-09-01 16:49:26',NULL),(4,34,'صهيب ','وظيفة','ووظيفة','suhaib1234@aba.ps','5592679732','2026-09-05 13:49:39','2026-09-05 13:49:39',NULL);
/*!40000 ALTER TABLE `profiles_system` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles_undergrad`
--

DROP TABLE IF EXISTS `profiles_undergrad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profiles_undergrad` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL COMMENT 'ربط بالمستخدم',
  `full_name` varchar(200) NOT NULL COMMENT 'الاسم الكامل',
  `uni_id` varchar(50) DEFAULT NULL COMMENT 'الرقم الجامعي',
  `national_id` varchar(20) DEFAULT NULL COMMENT 'رقم الهوية الوطنية',
  `uni_email` varchar(191) DEFAULT NULL COMMENT 'البريد الجامعي',
  `personal_email` varchar(191) DEFAULT NULL COMMENT 'البريد الشخصي',
  `phone` varchar(30) DEFAULT NULL COMMENT 'رقم الهاتف',
  `gender` enum('male','female') DEFAULT NULL COMMENT 'الجنس',
  `dob` date DEFAULT NULL COMMENT 'تاريخ الميلاد',
  `university` varchar(200) DEFAULT NULL COMMENT 'الجامعة',
  `college` varchar(200) DEFAULT NULL COMMENT 'الكلية',
  `department` varchar(200) DEFAULT NULL COMMENT 'القسم',
  `major` varchar(200) DEFAULT NULL COMMENT 'التخصص',
  `study_year` enum('year1','year2','year3','year4','year5') DEFAULT NULL COMMENT 'سنة الدراسة',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `avatar_path` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_uni_id` (`uni_id`),
  KEY `idx_national_id` (`national_id`),
  CONSTRAINT `fk_undergrad_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ملف طالب البكالوريوس';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles_undergrad`
--

LOCK TABLES `profiles_undergrad` WRITE;
/*!40000 ALTER TABLE `profiles_undergrad` DISABLE KEYS */;
INSERT INTO `profiles_undergrad` VALUES (1,1,'osama','123','456','os@ty.edu','os@gmail.com','796484613','male','2026-08-13','opt1','opt1','com1','com2','year2','2026-08-12 21:05:32','2026-08-12 21:05:32',NULL),(2,2,'مستخدم تجريبي','1','1','a@a.a','a@a.a','1','male','2026-08-13','5','14','11','22','year1','2026-08-12 21:17:58','2026-09-14 17:13:54',NULL),(3,9,'بليبلا','25345','34636','q@q.q','q@q.q','333','female','2026-08-13','1','1','dfhdh','dghfghj','year2','2026-08-13 01:33:32','2026-08-13 01:33:32',NULL),(4,13,'gdnfgnj','dfh','dgh','qwe@qwe.qweaa','qwe@qwe.qweaa','dfngfj','female','2026-08-27','2','6','ghfgj','dbhdgh','year3','2026-08-13 03:00:10','2026-08-13 03:00:10',NULL),(5,21,'Test Undergrad',NULL,NULL,NULL,NULL,'7700000001',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-09-01 16:49:16','2026-09-01 16:49:16',NULL),(6,31,'Dup Test',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-09-01 16:49:37','2026-09-01 16:49:37',NULL);
/*!40000 ALTER TABLE `profiles_undergrad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proofreading_requests`
--

DROP TABLE IF EXISTS `proofreading_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proofreading_requests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `assigned_provider_id` bigint(20) unsigned DEFAULT NULL,
  `citation_style` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `file_size` int(10) unsigned DEFAULT NULL,
  `file_ext` varchar(10) DEFAULT NULL,
  `status` enum('pending','assigned','in_progress','completed','rejected') NOT NULL DEFAULT 'pending',
  `result_notes` text DEFAULT NULL,
  `result_file_name` varchar(255) DEFAULT NULL,
  `result_file_path` varchar(500) DEFAULT NULL,
  `result_file_size` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_pr_provider` (`assigned_provider_id`),
  KEY `idx_pr_user` (`user_id`),
  KEY `idx_pr_status` (`status`),
  CONSTRAINT `fk_pr_provider` FOREIGN KEY (`assigned_provider_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proofreading_requests`
--

LOCK TABLES `proofreading_requests` WRITE;
/*!40000 ALTER TABLE `proofreading_requests` DISABLE KEYS */;
INSERT INTO `proofreading_requests` VALUES (2,18,NULL,'APA','test','sample_cv.pdf','uploads/service_results/proofreading_18_1788281602_sample_cv.pdf',37,'pdf','pending',NULL,NULL,NULL,NULL,'2026-09-01 16:53:22','2026-09-01 16:53:22');
/*!40000 ALTER TABLE `proofreading_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publication_requests`
--

DROP TABLE IF EXISTS `publication_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `publication_requests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `assigned_provider_id` bigint(20) unsigned DEFAULT NULL,
  `target_journal` varchar(500) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `file_size` int(10) unsigned DEFAULT NULL,
  `file_ext` varchar(10) DEFAULT NULL,
  `status` enum('pending','assigned','in_progress','completed','rejected') NOT NULL DEFAULT 'pending',
  `result_notes` text DEFAULT NULL,
  `result_file_name` varchar(255) DEFAULT NULL,
  `result_file_path` varchar(500) DEFAULT NULL,
  `result_file_size` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_pub_provider` (`assigned_provider_id`),
  KEY `idx_pub_user` (`user_id`),
  KEY `idx_pub_status` (`status`),
  CONSTRAINT `fk_pub_provider` FOREIGN KEY (`assigned_provider_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pub_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publication_requests`
--

LOCK TABLES `publication_requests` WRITE;
/*!40000 ALTER TABLE `publication_requests` DISABLE KEYS */;
INSERT INTO `publication_requests` VALUES (1,18,32,'Elsevier Journal','test','sample_cv.pdf','uploads/service_results/publication_18_1788281613_sample_cv.pdf',37,'pdf','completed','Test result for publication',NULL,NULL,NULL,'2026-09-01 16:53:33','2026-09-01 22:03:57'),(2,18,NULL,'Journal of Advanced Research','Title: Deep Learning for X\nAbstract: This paper explores...\nKeywords: AI, ML\nAuthors: John Doe <john@example.com>','sample_cv.pdf','uploads/service_results/publication_18_1788282595_sample_cv.pdf',37,'pdf','pending',NULL,NULL,NULL,NULL,'2026-09-01 17:09:55','2026-09-01 17:09:55');
/*!40000 ALTER TABLE `publication_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ref_colleges`
--

DROP TABLE IF EXISTS `ref_colleges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ref_colleges` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `university_id` int(10) unsigned DEFAULT NULL COMMENT 'NULL = كلية عامة',
  `name_ar` varchar(200) NOT NULL,
  `name_en` varchar(200) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_university` (`university_id`),
  KEY `idx_active_sort` (`is_active`,`sort_order`),
  CONSTRAINT `fk_college_university` FOREIGN KEY (`university_id`) REFERENCES `ref_universities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول مرجعي للكليات';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_colleges`
--

LOCK TABLES `ref_colleges` WRITE;
/*!40000 ALTER TABLE `ref_colleges` DISABLE KEYS */;
INSERT INTO `ref_colleges` VALUES (1,1,'كلية العلوم','College of Science',1,1,'2026-08-12 21:11:04'),(2,1,'كلية الهندسة','College of Engineering',1,2,'2026-08-12 21:11:04'),(3,1,'كلية الحاسب الآلي وتقنية المعلومات','College of Computer & Information Sciences',1,3,'2026-08-12 21:11:04'),(4,1,'كلية إدارة الأعمال','College of Business Administration',1,4,'2026-08-12 21:11:04'),(5,2,'كلية العلوم','Faculty of Science',1,1,'2026-08-12 21:11:04'),(6,2,'كلية الهندسة','Faculty of Engineering',1,2,'2026-08-12 21:11:04'),(7,2,'كلية الاقتصاد والإدارة','Faculty of Economics & Administration',1,3,'2026-08-12 21:11:04'),(8,3,'كلية العلوم','College of Science',1,1,'2026-08-12 21:11:04'),(9,3,'كلية الطب','College of Medicine',1,2,'2026-08-12 21:11:04'),(10,3,'كلية الهندسة','College of Engineering',1,3,'2026-08-12 21:11:04'),(11,4,'كلية العلوم التطبيقية','College of Applied Sciences',1,1,'2026-08-12 21:11:04'),(12,4,'كلية الهندسة','College of Engineering',1,2,'2026-08-12 21:11:04'),(13,5,'كلية العلوم','College of Science',1,1,'2026-08-12 21:11:04'),(14,5,'كلية الحاسب الآلي','College of Computer and Information Science',1,2,'2026-08-12 21:11:04');
/*!40000 ALTER TABLE `ref_colleges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ref_universities`
--

DROP TABLE IF EXISTS `ref_universities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ref_universities` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name_ar` varchar(200) NOT NULL,
  `name_en` varchar(200) DEFAULT NULL,
  `country_code` char(2) DEFAULT NULL COMMENT 'رمز الدولة ISO',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_country` (`country_code`),
  KEY `idx_active_sort` (`is_active`,`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول مرجعي للجامعات';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_universities`
--

LOCK TABLES `ref_universities` WRITE;
/*!40000 ALTER TABLE `ref_universities` DISABLE KEYS */;
INSERT INTO `ref_universities` VALUES (1,'جامعة الملك سعود','King Saud University','SA',1,1,'2026-08-12 21:11:04'),(2,'جامعة الملك عبدالعزيز','King Abdulaziz University','SA',1,2,'2026-08-12 21:11:04'),(3,'جامعة الإمام عبدالرحمن فيصل','Imam Abdulrahman Bin Faisal University','SA',1,3,'2026-08-12 21:11:04'),(4,'جامعة الملك فهد للبترول والمعادن','King Fahd University of Petroleum & Minerals','SA',1,4,'2026-08-12 21:11:04'),(5,'جامعة الأميرة نورة بنت عبدالرحمن','Princess Nourah bint Abdulrahman University','SA',1,5,'2026-08-12 21:11:04');
/*!40000 ALTER TABLE `ref_universities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registration_logs`
--

DROP TABLE IF EXISTS `registration_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `registration_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL COMMENT 'NULL إذا فشلت قبل إنشاء المستخدم',
  `role_id` tinyint(3) unsigned DEFAULT NULL COMMENT 'معرف الدور',
  `event_type` enum('attempt','step_completed','success','failure','email_sent','verified') NOT NULL COMMENT 'نوع الحدث: محاولة، إتمام خطوة، نجاح، فشل، إرسال تأكيد، تأكيد بريد',
  `step_number` tinyint(3) unsigned DEFAULT NULL COMMENT 'رقم الخطوة',
  `ip_address` varchar(45) DEFAULT NULL COMMENT 'عنوان IP',
  `user_agent` varchar(500) DEFAULT NULL COMMENT 'متصفح المستخدم',
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'تفاصيل إضافية' CHECK (json_valid(`details`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_event_type` (`event_type`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='سجل عمليات التسجيل';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registration_logs`
--

LOCK TABLES `registration_logs` WRITE;
/*!40000 ALTER TABLE `registration_logs` DISABLE KEYS */;
INSERT INTO `registration_logs` VALUES (1,1,1,'success',3,'::1',NULL,NULL,'2026-08-12 21:05:32'),(2,2,1,'success',3,'::1',NULL,NULL,'2026-08-12 21:17:58'),(3,3,2,'success',3,'::1',NULL,NULL,'2026-08-12 21:19:41'),(4,4,3,'success',3,'::1',NULL,NULL,'2026-08-12 21:20:55'),(5,5,4,'success',3,'::1',NULL,NULL,'2026-08-12 21:21:42'),(6,6,5,'success',3,'::1',NULL,NULL,'2026-08-12 21:22:46'),(7,9,1,'success',3,'::1',NULL,NULL,'2026-08-13 01:33:32'),(8,11,10,'success',3,'::1',NULL,NULL,'2026-08-13 01:43:17'),(9,12,2,'success',3,'::1',NULL,NULL,'2026-08-13 02:59:29'),(10,13,1,'success',3,'::1',NULL,NULL,'2026-08-13 03:00:10'),(11,14,6,'success',3,'::1',NULL,NULL,'2026-08-13 03:02:53'),(12,15,2,'success',3,'37.202.98.36',NULL,NULL,'2026-08-13 03:37:10'),(13,16,3,'success',3,'188.225.161.195',NULL,NULL,'2026-08-17 13:35:04'),(14,17,10,'success',3,'212.34.12.125',NULL,NULL,'2026-08-17 13:56:37'),(15,20,2,'success',3,'::1',NULL,NULL,'2026-08-31 18:47:48'),(16,21,1,'success',3,'::1',NULL,NULL,'2026-09-01 16:49:16'),(17,22,2,'success',3,'::1',NULL,NULL,'2026-09-01 16:49:17'),(18,23,3,'success',3,'::1',NULL,NULL,'2026-09-01 16:49:17'),(19,24,4,'success',3,'::1',NULL,NULL,'2026-09-01 16:49:17'),(20,25,9,'success',3,'::1',NULL,NULL,'2026-09-01 16:49:26'),(21,26,5,'success',3,'::1',NULL,NULL,'2026-09-01 16:49:26'),(22,27,6,'success',3,'::1',NULL,NULL,'2026-09-01 16:49:26'),(23,28,7,'success',3,'::1',NULL,NULL,'2026-09-01 16:49:26'),(24,29,8,'success',3,'::1',NULL,NULL,'2026-09-01 16:49:26'),(25,30,10,'success',3,'::1',NULL,NULL,'2026-09-01 16:49:26'),(26,31,1,'success',3,'::1',NULL,NULL,'2026-09-01 16:49:37'),(27,32,14,'success',3,'::1',NULL,NULL,'2026-09-01 16:50:04'),(28,33,14,'success',3,'::1',NULL,NULL,'2026-09-01 17:18:06'),(29,34,10,'success',3,'::1',NULL,NULL,'2026-09-05 13:49:39'),(30,36,5,'success',3,'::1',NULL,NULL,'2026-09-12 22:21:54');
/*!40000 ALTER TABLE `registration_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `researches`
--

DROP TABLE IF EXISTS `researches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `researches` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `title_ar` varchar(500) NOT NULL,
  `title_en` varchar(500) DEFAULT NULL,
  `abstract` text NOT NULL,
  `keywords` varchar(500) DEFAULT NULL,
  `field` enum('cs','eng','med') NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` int(10) unsigned DEFAULT NULL,
  `status` enum('draft','under_review','published','rejected') NOT NULL DEFAULT 'under_review',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_research_user_status` (`user_id`,`status`),
  KEY `idx_research_field` (`field`),
  CONSTRAINT `fk_research_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `researches`
--

LOCK TABLES `researches` WRITE;
/*!40000 ALTER TABLE `researches` DISABLE KEYS */;
INSERT INTO `researches` VALUES (2,18,'?????? ????????? ?? ??????? ??????',NULL,'????? ??? ??????? ?????? ????????? ?? ???? ???????','???? ???????, ?????','cs','test_research.pdf','uploads/researches/research_18_1788199365_test_research.pdf',38,'under_review',NULL,'2026-08-31 18:02:45','2026-08-31 18:02:45');
/*!40000 ALTER TABLE `researches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_requests`
--

DROP TABLE IF EXISTS `review_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `review_requests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `research_title` varchar(500) NOT NULL,
  `review_type` enum('initial','expert','final') NOT NULL,
  `academic_level` enum('bachelor','master','phd') NOT NULL,
  `parent_request_id` bigint(20) unsigned DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `file_size` int(10) unsigned DEFAULT NULL,
  `file_ext` varchar(10) DEFAULT NULL,
  `status` enum('pending','in_progress','info_needed','revision_required','completed','rejected') NOT NULL DEFAULT 'pending',
  `progress` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `score` decimal(5,2) DEFAULT NULL,
  `info_needed_ar` text DEFAULT NULL,
  `info_needed_en` text DEFAULT NULL,
  `revision_note_ar` text DEFAULT NULL,
  `revision_note_en` text DEFAULT NULL,
  `reviewer_id` bigint(20) unsigned DEFAULT NULL,
  `reviewed_file_name` varchar(255) DEFAULT NULL,
  `reviewed_file_path` varchar(500) DEFAULT NULL,
  `reviewed_file_size` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_review_req_parent` (`parent_request_id`),
  KEY `fk_review_req_reviewer` (`reviewer_id`),
  KEY `idx_review_req_user` (`user_id`),
  KEY `idx_review_req_type_status` (`review_type`,`status`),
  CONSTRAINT `fk_review_req_parent` FOREIGN KEY (`parent_request_id`) REFERENCES `review_requests` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_review_req_reviewer` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_review_req_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_requests`
--

LOCK TABLES `review_requests` WRITE;
/*!40000 ALTER TABLE `review_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `review_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `research_id` bigint(20) unsigned NOT NULL,
  `reviewer_id` bigint(20) unsigned NOT NULL,
  `review_type` enum('initial','expert','final') NOT NULL,
  `status` enum('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
  `score` decimal(5,2) DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_review_reviewer_status` (`reviewer_id`,`status`),
  KEY `idx_review_research` (`research_id`),
  CONSTRAINT `fk_review_research` FOREIGN KEY (`research_id`) REFERENCES `researches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_reviewer` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,2,18,'initial','completed',85.50,'??? ??? ????? ??????? ?????','2026-08-31 18:03:55','2026-08-31 18:03:55','2026-08-31 18:03:55','2026-08-31 18:03:55');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT COMMENT 'المعرف الرئيسي',
  `key` varchar(50) NOT NULL COMMENT 'مفتاح الدور بالإنجليزية',
  `name_ar` varchar(100) NOT NULL COMMENT 'اسم الدور بالعربي',
  `name_en` varchar(100) NOT NULL COMMENT 'اسم الدور بالإنجليزي',
  `icon` varchar(50) NOT NULL COMMENT 'اسم أيقونة الدور',
  `category` enum('individual','academic','entity') NOT NULL COMMENT 'تصنيف الدور',
  `sort_order` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT 'ترتيب العرض',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'هل الدور مفعل للتسجيل',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_key` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول الأدوار التسعة المنفصل';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'undergrad','طالب بكالوريوس','Undergraduate Student','GraduationCap','academic',1,1,'2026-08-12 20:20:34'),(2,'grad','طالب دراسات عليا','Graduate Student','BookOpen','academic',2,1,'2026-08-12 20:20:34'),(3,'faculty','هيئة تدريسية','Faculty Member','UserCheck','academic',3,1,'2026-08-12 20:20:34'),(4,'researcher','باحث','Researcher','Microscope','individual',4,1,'2026-08-12 20:20:34'),(5,'university','جامعة','University','Building2','entity',5,1,'2026-08-12 20:20:34'),(6,'college','كلية','College','Building2','entity',6,1,'2026-08-12 20:20:34'),(7,'research_center','مركز بحثي','Research Center','FlaskConical','entity',7,1,'2026-08-12 20:20:34'),(8,'ministry','وزارة','Ministry','Landmark','entity',8,1,'2026-08-12 20:20:34'),(9,'reviewer','محكم','Reviewer','Award','individual',9,1,'2026-08-12 20:20:34'),(10,'employee','موظف عادي','Employee','UserCog','',10,1,'2026-08-13 00:50:31'),(14,'service_provider','مقدّم خدمة','Service Provider','Briefcase','individual',11,1,'2026-09-01 16:47:52'),(15,'super_admin','مدير النظام','System Admin','ShieldCheck','individual',0,1,'2026-09-05 13:55:08');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_provider_services`
--

DROP TABLE IF EXISTS `service_provider_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_provider_services` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `service_slug` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_sps_user_slug` (`user_id`,`service_slug`),
  KEY `idx_sps_slug` (`service_slug`),
  CONSTRAINT `fk_sps_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_provider_services`
--

LOCK TABLES `service_provider_services` WRITE;
/*!40000 ALTER TABLE `service_provider_services` DISABLE KEYS */;
INSERT INTO `service_provider_services` VALUES (1,32,'translation','2026-09-01 16:50:04'),(2,32,'proofreading','2026-09-01 16:50:04'),(3,33,'translation','2026-09-01 17:18:06'),(4,33,'proofreading','2026-09-01 17:18:06'),(5,32,'consultation','2026-09-01 22:03:41'),(6,32,'journal-selection','2026-09-01 22:03:41'),(7,32,'journal-evaluation','2026-09-01 22:03:41'),(8,32,'template','2026-09-01 22:03:41'),(9,32,'correspondence','2026-09-01 22:03:41'),(10,32,'publication','2026-09-01 22:03:41');
/*!40000 ALTER TABLE `service_provider_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_info`
--

DROP TABLE IF EXISTS `site_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site_info` (
  `id` int(11) NOT NULL DEFAULT 1,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `address_ar` text DEFAULT NULL,
  `address_en` text DEFAULT NULL,
  `x_link` varchar(255) DEFAULT NULL,
  `instagram_link` varchar(255) DEFAULT NULL,
  `linkedin_link` varchar(255) DEFAULT NULL,
  `youtube_link` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_info`
--

LOCK TABLES `site_info` WRITE;
/*!40000 ALTER TABLE `site_info` DISABLE KEYS */;
INSERT INTO `site_info` VALUES (1,'+218 21 XXX XXXX','info@source.com','طرابلس، ليبيا — وزارة التعليم العالي والبحث العلمي','Tripoli, Libya — Ministry of Higher Education and Scientific Research','https://x.com/source','https://instagram.com/source','https://linkedin.com/company/source','https://youtube.com/source');
/*!40000 ALTER TABLE `site_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `created_by` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=355 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES (1,'site_logo','uploads/site_logo_1786295455.png',0,'2026-07-31 10:12:54','2026-08-09 17:10:55'),(2,'site_favicon','/favicon.png',0,'2026-07-31 10:12:54','2026-09-15 16:47:25'),(3,'site_name_ar','سورس',0,'2026-07-31 10:12:54','2026-08-09 17:10:34'),(4,'site_name_en','SOURCE',0,'2026-07-31 10:12:54','2026-09-15 16:47:25'),(5,'site_tagline_ar','نظام التصنيف والتميّز البحثي',0,'2026-07-31 10:12:54','2026-09-15 16:47:25'),(6,'site_tagline_en','Research Classification & Excellence System',0,'2026-07-31 10:12:54','2026-09-15 16:47:25'),(7,'hero_badge_ar','نظام التميز المؤسسي والجامعي والبحثي والتصنيفي',0,'2026-07-31 10:12:54','2026-08-09 17:11:52'),(8,'hero_badge_en','System for Organizational University , Research & Classification Excellence',0,'2026-07-31 10:12:54','2026-08-09 17:11:52'),(9,'hero_title_ar','سورس',0,'2026-07-31 10:12:54','2026-08-09 17:11:52'),(10,'hero_title_en','IR SOURCE',0,'2026-07-31 10:12:54','2026-08-09 17:11:52'),(11,'hero_desc_ar','نوفر بيئة متكاملة للباحثين والمؤسسات الأكاديمية لإدارة الأبحاث والنشر العلمي والمنح البحثية بكل كفاءة',0,'2026-07-31 10:12:54','2026-07-28 19:34:24'),(12,'hero_desc_en','We provide an integrated environment for researchers and academic institutions to manage research, scientific publishing, and research grants with maximum efficiency',0,'2026-07-31 10:12:54','2026-07-28 19:34:24'),(13,'admin_email','admin@site.com',0,'2026-07-31 10:12:54','2026-07-28 19:52:33'),(14,'admin_password','Admin@123456',0,'2026-07-31 10:12:54','2026-07-28 19:52:33');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `title_ar` varchar(300) NOT NULL,
  `title_en` varchar(300) NOT NULL,
  `status` enum('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
  `due_date` date DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_task_creator` (`created_by`),
  KEY `idx_task_user_status` (`user_id`,`status`),
  CONSTRAINT `fk_task_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_task_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,18,'???? ???? ??????','Complete your profile','completed','2026-09-15','2026-08-31 14:23:39',NULL,'2026-08-31 14:23:39','2026-08-31 14:23:39'),(2,18,'??? ??????? ??????','Submit annual report','in_progress','2026-10-01',NULL,NULL,'2026-08-31 14:23:39','2026-08-31 14:23:39');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `template_requests`
--

DROP TABLE IF EXISTS `template_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `template_requests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `assigned_provider_id` bigint(20) unsigned DEFAULT NULL,
  `journal_name` varchar(500) NOT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('pending','assigned','in_progress','completed','rejected') NOT NULL DEFAULT 'pending',
  `result_notes` text DEFAULT NULL,
  `result_file_name` varchar(255) DEFAULT NULL,
  `result_file_path` varchar(500) DEFAULT NULL,
  `result_file_size` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_tpr_provider` (`assigned_provider_id`),
  KEY `idx_tpr_user` (`user_id`),
  KEY `idx_tpr_status` (`status`),
  CONSTRAINT `fk_tpr_provider` FOREIGN KEY (`assigned_provider_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tpr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `template_requests`
--

LOCK TABLES `template_requests` WRITE;
/*!40000 ALTER TABLE `template_requests` DISABLE KEYS */;
INSERT INTO `template_requests` VALUES (1,18,32,'IEEE Access','test','completed','Test result for template',NULL,NULL,NULL,'2026-09-01 16:53:33','2026-09-01 22:03:57'),(2,18,NULL,'Journal of Advanced Research','Need APA format','pending',NULL,NULL,NULL,NULL,'2026-09-01 17:09:47','2026-09-01 17:09:47');
/*!40000 ALTER TABLE `template_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `translation_requests`
--

DROP TABLE IF EXISTS `translation_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `translation_requests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `assigned_provider_id` bigint(20) unsigned DEFAULT NULL,
  `source_lang` varchar(50) DEFAULT NULL,
  `target_lang` varchar(50) DEFAULT NULL,
  `urgency` enum('normal','fast','urgent') NOT NULL DEFAULT 'normal',
  `english_variant` varchar(10) DEFAULT NULL,
  `field_ar` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `file_size` int(10) unsigned DEFAULT NULL,
  `file_ext` varchar(10) DEFAULT NULL,
  `status` enum('pending','assigned','in_progress','completed','rejected') NOT NULL DEFAULT 'pending',
  `result_notes` text DEFAULT NULL,
  `result_file_name` varchar(255) DEFAULT NULL,
  `result_file_path` varchar(500) DEFAULT NULL,
  `result_file_size` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_tr_provider` (`assigned_provider_id`),
  KEY `idx_tr_user` (`user_id`),
  KEY `idx_tr_status` (`status`),
  CONSTRAINT `fk_tr_provider` FOREIGN KEY (`assigned_provider_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `translation_requests`
--

LOCK TABLES `translation_requests` WRITE;
/*!40000 ALTER TABLE `translation_requests` DISABLE KEYS */;
INSERT INTO `translation_requests` VALUES (2,18,32,'Arabic','English','normal',NULL,'?????','test','sample_cv.pdf','uploads/service_results/translation_18_1788281601_sample_cv.pdf',37,'pdf','completed','Translation complete, see attached','sample_cv.pdf','uploads/service_results/result_translation_2_1788281697_sample_cv.pdf',37,'2026-09-01 16:53:21','2026-09-01 16:54:57'),(3,18,NULL,'ar','en','urgent','uk',NULL,'Please be careful with terms','sample_cv.pdf','uploads/service_results/translation_18_1788282063_sample_cv.pdf',37,'pdf','pending',NULL,NULL,NULL,NULL,'2026-09-01 17:01:03','2026-09-01 17:01:03');
/*!40000 ALTER TABLE `translation_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `universities`
--

DROP TABLE IF EXISTS `universities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `universities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(300) NOT NULL,
  `arabic_name` varchar(255) DEFAULT NULL,
  `country` varchar(120) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `official_domains` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `universities`
--

LOCK TABLES `universities` WRITE;
/*!40000 ALTER TABLE `universities` DISABLE KEYS */;
INSERT INTO `universities` VALUES (1,'جامعة تجريبية','جامعة تجريبية','العراق','gov','testuni.edu.iq','2026-09-12 22:19:00','2026-09-14 17:13:54');
/*!40000 ALTER TABLE `universities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `university_campuses`
--

DROP TABLE IF EXISTS `university_campuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `university_campuses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `university_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_campus_user` (`user_id`),
  KEY `idx_campus_university` (`university_id`),
  CONSTRAINT `fk_campus_university` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_campus_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `university_campuses`
--

LOCK TABLES `university_campuses` WRITE;
/*!40000 ALTER TABLE `university_campuses` DISABLE KEYS */;
INSERT INTO `university_campuses` VALUES (2,18,1,'الحرم الرئيسي المُعدَّل','بغداد',0,NULL,'2026-09-12 22:21:20'),(4,18,1,'حرم جديد','البصرة',1,'2026-09-14 18:14:51','2026-09-14 18:14:39');
/*!40000 ALTER TABLE `university_campuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `university_colleges`
--

DROP TABLE IF EXISTS `university_colleges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `university_colleges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `university_id` int(11) DEFAULT NULL,
  `campus_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_college_user` (`user_id`),
  KEY `idx_college_campus` (`campus_id`),
  KEY `idx_college_university` (`university_id`),
  CONSTRAINT `fk_college_campus` FOREIGN KEY (`campus_id`) REFERENCES `university_campuses` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_college_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ucollege_university` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `university_colleges`
--

LOCK TABLES `university_colleges` WRITE;
/*!40000 ALTER TABLE `university_colleges` DISABLE KEYS */;
INSERT INTO `university_colleges` VALUES (2,18,1,2,'كلية الهندسة المُعدَّلة',0,NULL,'2026-09-12 22:21:20');
/*!40000 ALTER TABLE `university_colleges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `university_departments`
--

DROP TABLE IF EXISTS `university_departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `university_departments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `university_id` int(11) DEFAULT NULL,
  `college_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_department_user` (`user_id`),
  KEY `idx_department_college` (`college_id`),
  KEY `idx_department_university` (`university_id`),
  CONSTRAINT `fk_department_college` FOREIGN KEY (`college_id`) REFERENCES `university_colleges` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_department_university` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_department_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `university_departments`
--

LOCK TABLES `university_departments` WRITE;
/*!40000 ALTER TABLE `university_departments` DISABLE KEYS */;
INSERT INTO `university_departments` VALUES (2,18,1,2,'قسم الحاسوب المُعدَّل',0,NULL,'2026-09-12 22:21:20');
/*!40000 ALTER TABLE `university_departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `university_profiles`
--

DROP TABLE IF EXISTS `university_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `university_profiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `university_id` int(11) DEFAULT NULL,
  `country` varchar(120) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `official_domains` text DEFAULT NULL,
  `arabic_name` varchar(255) DEFAULT NULL,
  `research_strategy` text DEFAULT NULL,
  `priority_areas` text DEFAULT NULL,
  `research_goals` text DEFAULT NULL,
  `profile_status` enum('draft','submitted','under_review','approved') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_university_profile_university` (`university_id`),
  CONSTRAINT `fk_up_university` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `university_profiles`
--

LOCK TABLES `university_profiles` WRITE;
/*!40000 ALTER TABLE `university_profiles` DISABLE KEYS */;
INSERT INTO `university_profiles` VALUES (1,18,1,'??????','gov','testuni.edu.iq','????? ???????','test strategy','[\"area1\"]','[\"goal1\"]','submitted','2026-09-12 20:39:46','2026-09-14 18:14:23');
/*!40000 ALTER TABLE `university_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `university_readiness_assessments`
--

DROP TABLE IF EXISTS `university_readiness_assessments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `university_readiness_assessments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `university_id` int(11) DEFAULT NULL,
  `assessment_type` varchar(30) DEFAULT NULL,
  `diagnostic_version` varchar(10) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `request_payload` longtext DEFAULT NULL,
  `response_json` longtext DEFAULT NULL,
  `overall_score` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_readiness_user` (`user_id`),
  KEY `idx_readiness_university` (`university_id`),
  CONSTRAINT `fk_readiness_university` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_readiness_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `university_readiness_assessments`
--

LOCK TABLES `university_readiness_assessments` WRITE;
/*!40000 ALTER TABLE `university_readiness_assessments` DISABLE KEYS */;
INSERT INTO `university_readiness_assessments` VALUES (1,18,1,'legacy_readiness',NULL,'gpt-4o-mini','{\"user_id\":18,\"entity_name\":\"جامعة تجريبية\",\"entity_type\":\"gov\",\"website\":null,\"official_email\":\"info@testuni.edu.iq\",\"phone\":\"07701234567\",\"address\":null,\"arabic_name\":\"جامعة تجريبية\",\"country\":\"العراق\",\"type\":\"gov\",\"official_domains\":\"testuni.edu.iq\",\"research_strategy\":\"????? ????? ???????? - ????? ??? ???????\",\"priority_areas\":[\"?????? ?????????\",\"?????? ????????\",\"????? ?????????\"],\"research_goals\":[\"??? 50 ????? ??????\"],\"profile_status\":\"submitted\",\"campuses\":[{\"id\":2,\"name\":\"????? ???????\",\"location\":\"?????\"}],\"colleges\":[{\"id\":2,\"campus_id\":2,\"name\":\"???? ???????\"}],\"departments\":[{\"id\":2,\"college_id\":2,\"name\":\"??? ???????\"}],\"research_centers\":[]}','{\"overall_readiness_percent\":20,\"dimensions\":[{\"key\":\"data\",\"label_ar\":\"جاهزية البيانات\",\"label_en\":\"Data Readiness\",\"percent\":10,\"status\":\"not_met\"},{\"key\":\"evidence\",\"label_ar\":\"جاهزية الأدلة\",\"label_en\":\"Evidence Readiness\",\"percent\":10,\"status\":\"not_met\"},{\"key\":\"definition\",\"label_ar\":\"جاهزية التعريفات\",\"label_en\":\"Definition Readiness\",\"percent\":30,\"status\":\"partial\"},{\"key\":\"methodology\",\"label_ar\":\"جاهزية المنهجية\",\"label_en\":\"Methodology Readiness\",\"percent\":20,\"status\":\"not_met\"},{\"key\":\"performance\",\"label_ar\":\"جاهزية الأداء\",\"label_en\":\"Performance Readiness\",\"percent\":30,\"status\":\"partial\"}],\"category_scores\":{\"quality\":20,\"productivity\":10,\"impact\":15,\"funding\":5,\"internationalization\":0,\"governance\":10},\"critical_gaps\":[{\"ar\":\"عدم وضوح استراتيجية البحث\",\"en\":\"Lack of clarity in research strategy\"},{\"ar\":\"غياب المراكز البحثية\",\"en\":\"Absence of research centers\"},{\"ar\":\"عدم وجود بيانات كافية عن الكليات والأقسام\",\"en\":\"Insufficient data on colleges and departments\"}],\"opportunities\":[{\"ar\":\"تطوير استراتيجية بحث واضحة\",\"en\":\"Develop a clear research strategy\"},{\"ar\":\"إنشاء مراكز بحثية جديدة\",\"en\":\"Establish new research centers\"},{\"ar\":\"زيادة التعاون الدولي في البحث\",\"en\":\"Increase international collaboration in research\"}],\"generated_at\":\"2026-09-14T19:57:18+02:00\",\"model\":\"gpt-4o-mini\",\"provider\":\"openai\"}',20.00,'2026-09-14 17:57:18'),(2,18,1,'legacy_readiness',NULL,'gpt-4o-mini','{\"user_id\":18,\"entity_name\":\"جامعة تجريبية\",\"entity_type\":\"gov\",\"website\":null,\"official_email\":\"info@testuni.edu.iq\",\"phone\":\"07701234567\",\"address\":null,\"arabic_name\":\"جامعة تجريبية\",\"country\":\"العراق\",\"type\":\"gov\",\"official_domains\":\"testuni.edu.iq\",\"research_strategy\":\"????? ????? ???????? - ????? ??? ???????\",\"priority_areas\":[\"?????? ?????????\",\"?????? ????????\",\"????? ?????????\"],\"research_goals\":[\"??? 50 ????? ??????\"],\"profile_status\":\"submitted\",\"campuses\":[{\"id\":2,\"name\":\"????? ???????\",\"location\":\"?????\"}],\"colleges\":[{\"id\":2,\"campus_id\":2,\"name\":\"???? ???????\"}],\"departments\":[{\"id\":2,\"college_id\":2,\"name\":\"??? ???????\"}],\"research_centers\":[]}','{\"overall_readiness_percent\":20,\"dimensions\":[{\"key\":\"data\",\"label_ar\":\"جاهزية البيانات\",\"label_en\":\"Data Readiness\",\"percent\":10,\"status\":\"not_met\"},{\"key\":\"evidence\",\"label_ar\":\"جاهزية الأدلة\",\"label_en\":\"Evidence Readiness\",\"percent\":10,\"status\":\"not_met\"},{\"key\":\"definition\",\"label_ar\":\"جاهزية التعريفات\",\"label_en\":\"Definition Readiness\",\"percent\":20,\"status\":\"partial\"},{\"key\":\"methodology\",\"label_ar\":\"جاهزية المنهجية\",\"label_en\":\"Methodology Readiness\",\"percent\":20,\"status\":\"partial\"},{\"key\":\"performance\",\"label_ar\":\"جاهزية الأداء\",\"label_en\":\"Performance Readiness\",\"percent\":30,\"status\":\"partial\"}],\"category_scores\":{\"quality\":20,\"productivity\":10,\"impact\":15,\"funding\":0,\"internationalization\":0,\"governance\":10},\"critical_gaps\":[{\"ar\":\"عدم وضوح استراتيجية البحث\",\"en\":\"Lack of clarity in research strategy\"},{\"ar\":\"غياب مراكز بحثية\",\"en\":\"Absence of research centers\"}],\"opportunities\":[{\"ar\":\"تطوير استراتيجية بحثية واضحة\",\"en\":\"Develop a clear research strategy\"},{\"ar\":\"إنشاء مراكز بحثية جديدة\",\"en\":\"Establish new research centers\"}],\"generated_at\":\"2026-09-14T19:57:50+02:00\",\"model\":\"gpt-4o-mini\",\"provider\":\"openai\"}',20.00,'2026-09-14 17:57:50'),(3,18,1,'ai_research_profile_diagnostic','1.0','gpt-4o-mini','{\"user_id\":18,\"entity_name\":\"جامعة تجريبية\",\"entity_type\":\"gov\",\"website\":null,\"official_email\":\"info@testuni.edu.iq\",\"phone\":\"07701234567\",\"address\":null,\"arabic_name\":\"جامعة تجريبية\",\"country\":\"العراق\",\"type\":\"gov\",\"official_domains\":\"testuni.edu.iq\",\"research_strategy\":\"test strategy\",\"priority_areas\":[\"area1\"],\"research_goals\":[\"goal1\"],\"profile_status\":\"submitted\",\"campuses\":[{\"id\":2,\"name\":\"الحرم الرئيسي المُعدَّل\",\"location\":\"بغداد\"}],\"colleges\":[{\"id\":2,\"campus_id\":2,\"name\":\"كلية الهندسة المُعدَّلة\"}],\"departments\":[{\"id\":2,\"college_id\":2,\"name\":\"قسم الحاسوب المُعدَّل\"}],\"research_centers\":[]}','{\"diagnostic_version\":\"1.0\",\"profile_completeness\":{\"level\":\"low\",\"observations\":[{\"ar\":\"البيانات الأساسية مثل الموقع الإلكتروني والعنوان غير متوفرة.\",\"en\":\"Basic data such as the website and address are not available.\"},{\"ar\":\"لا توجد معلومات عن مراكز البحث، مما يشير إلى نقص في التنوع الأكاديمي.\",\"en\":\"There is no information about research centers, indicating a lack of academic diversity.\"},{\"ar\":\"استراتيجية البحث والأهداف محدودة وغير مفصلة.\",\"en\":\"The research strategy and goals are limited and not detailed.\"}]},\"missing_information\":[{\"ar\":\"الموقع الإلكتروني للجامعة.\",\"en\":\"The university\'s website.\"},{\"ar\":\"عنوان الجامعة.\",\"en\":\"The university\'s address.\"},{\"ar\":\"معلومات عن مراكز البحث.\",\"en\":\"Information about research centers.\"}],\"weaknesses\":[{\"ar\":\"نقص في التنوع الأكاديمي بسبب عدم وجود مراكز بحثية.\",\"en\":\"Lack of academic diversity due to the absence of research centers.\"},{\"ar\":\"استراتيجية البحث غير واضحة ولا تحتوي على تفاصيل كافية.\",\"en\":\"The research strategy is unclear and lacks sufficient details.\"}],\"suggested_priorities\":[{\"ar\":\"تطوير استراتيجية بحث شاملة تتضمن أهداف واضحة ومجالات أولوية متعددة.\",\"en\":\"Develop a comprehensive research strategy that includes clear goals and multiple priority areas.\"},{\"ar\":\"إنشاء مراكز بحثية لتعزيز التنوع الأكاديمي.\",\"en\":\"Establish research centers to enhance academic diversity.\"}],\"suggested_next_steps\":[{\"ar\":\"تحديث البيانات المفقودة مثل الموقع الإلكتروني والعنوان.\",\"en\":\"Update the missing data such as the website and address.\"},{\"ar\":\"توسيع المعلومات حول استراتيجية البحث والأهداف.\",\"en\":\"Expand information on the research strategy and goals.\"}],\"areas_requiring_more_data\":[{\"ar\":\"تفاصيل إضافية حول الكليات والأقسام.\",\"en\":\"Additional details about the colleges and departments.\"},{\"ar\":\"معلومات حول الأنشطة البحثية الحالية والمشاريع.\",\"en\":\"Information about current research activities and projects.\"}],\"potential_opportunities\":[{\"ar\":\"إمكانية التعاون مع الجامعات الأخرى لتعزيز البحث.\",\"en\":\"Opportunity for collaboration with other universities to enhance research.\"},{\"ar\":\"استغلال المجالات البحثية ذات الأولوية لتطوير مشاريع جديدة.\",\"en\":\"Leverage priority research areas to develop new projects.\"}],\"data_collection_recommendations\":[{\"ar\":\"جمع بيانات حول الأنشطة البحثية والمشاريع الجارية.\",\"en\":\"Collect data on research activities and ongoing projects.\"},{\"ar\":\"توفير معلومات عن الشراكات الأكاديمية والتعاونات البحثية.\",\"en\":\"Provide information about academic partnerships and research collaborations.\"}],\"generated_at\":\"2026-09-14T20:41:58+02:00\",\"model\":\"gpt-4o-mini\",\"provider\":\"openai\"}',NULL,'2026-09-14 18:41:58');
/*!40000 ALTER TABLE `university_readiness_assessments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `university_research_centers`
--

DROP TABLE IF EXISTS `university_research_centers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `university_research_centers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `university_id` int(11) DEFAULT NULL,
  `parent_unit_type` enum('university','campus','college','department') NOT NULL DEFAULT 'university',
  `parent_unit_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `research_areas` text DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_research_center_user` (`user_id`),
  KEY `idx_research_center_university` (`university_id`),
  CONSTRAINT `fk_research_center_university` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_research_center_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `university_research_centers`
--

LOCK TABLES `university_research_centers` WRITE;
/*!40000 ALTER TABLE `university_research_centers` DISABLE KEYS */;
INSERT INTO `university_research_centers` VALUES (1,18,1,'department',2,'مركز أبحاث الذكاء الاصطناعي','[\"AI\",\"ML\"]',0,'2026-09-14 18:16:15','2026-09-14 18:15:50'),(2,18,1,'department',2,'مركز أبحاث الذكاء الاصطناعي المُحدَّث','[\"AI\",\"ML\",\"Robotics\"]',0,'2026-09-14 18:16:57','2026-09-14 18:16:15');
/*!40000 ALTER TABLE `university_research_centers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `university_roles`
--

DROP TABLE IF EXISTS `university_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `university_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(50) NOT NULL,
  `name_ar` varchar(150) NOT NULL,
  `name_en` varchar(150) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_university_role_key` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `university_roles`
--

LOCK TABLES `university_roles` WRITE;
/*!40000 ALTER TABLE `university_roles` DISABLE KEYS */;
INSERT INTO `university_roles` VALUES (1,'admin','مدير الجامعة','University Admin',1,'2026-09-12 22:19:00'),(2,'member','عضو','Member',1,'2026-09-12 22:19:00'),(3,'research_office','مكتب البحث العلمي','Research Office',0,'2026-09-12 22:19:00'),(4,'researcher','باحث','Researcher',0,'2026-09-12 22:19:00'),(5,'data_steward','أمين البيانات','Data Steward',0,'2026-09-12 22:19:00'),(6,'evidence_reviewer','مراجع الأدلة','Evidence Reviewer',0,'2026-09-12 22:19:00'),(7,'expert','خبير','Expert',0,'2026-09-12 22:19:00'),(8,'executive','تنفيذي','Executive',0,'2026-09-12 22:19:00');
/*!40000 ALTER TABLE `university_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `university_users`
--

DROP TABLE IF EXISTS `university_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `university_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `university_id` int(11) NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `university_role_id` int(11) NOT NULL,
  `joined_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_uu_user` (`user_id`),
  KEY `idx_uu_university` (`university_id`),
  KEY `idx_uu_role` (`university_role_id`),
  CONSTRAINT `fk_uu_role` FOREIGN KEY (`university_role_id`) REFERENCES `university_roles` (`id`),
  CONSTRAINT `fk_uu_university` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_uu_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `university_users`
--

LOCK TABLES `university_users` WRITE;
/*!40000 ALTER TABLE `university_users` DISABLE KEYS */;
INSERT INTO `university_users` VALUES (1,1,18,1,'2026-09-12 22:19:00');
/*!40000 ALTER TABLE `university_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_settings`
--

DROP TABLE IF EXISTS `user_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_settings` (
  `user_id` bigint(20) unsigned NOT NULL,
  `notifications_email` tinyint(1) NOT NULL DEFAULT 1,
  `notifications_sms` tinyint(1) NOT NULL DEFAULT 0,
  `two_factor_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `language` enum('ar','en') NOT NULL DEFAULT 'ar',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_settings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_settings`
--

LOCK TABLES `user_settings` WRITE;
/*!40000 ALTER TABLE `user_settings` DISABLE KEYS */;
INSERT INTO `user_settings` VALUES (18,1,1,0,'en','2026-08-31 14:19:34','2026-08-31 14:19:34');
/*!40000 ALTER TABLE `user_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'المعرف الرئيسي',
  `role_id` tinyint(3) unsigned NOT NULL COMMENT 'معرف الدور - ربط بجدول roles',
  `email` varchar(191) NOT NULL COMMENT 'البريد الإلكتروني للدخول',
  `password_hash` varchar(255) NOT NULL COMMENT 'كلمة المرور المشفرة',
  `is_active` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'حساب مفعل (بعد التحقق)',
  `status` enum('pending','active','rejected') NOT NULL DEFAULT 'pending',
  `email_verified_at` timestamp NULL DEFAULT NULL COMMENT 'تاريخ تأكيد البريد',
  `registration_step` tinyint(3) unsigned NOT NULL DEFAULT 1 COMMENT 'آخر خطوة وصل لها بالتسجيل',
  `registration_ip` varchar(45) DEFAULT NULL COMMENT 'IP التسجيل',
  `last_login_at` timestamp NULL DEFAULT NULL COMMENT 'آخر دخول',
  `last_login_ip` varchar(45) DEFAULT NULL COMMENT 'IP آخر دخول',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'الحذف الناعم',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_email` (`email`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_deleted_at` (`deleted_at`),
  KEY `idx_users_status` (`status`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول المستخدمين - يحتوي فقط على بيانات المصادقة المشتركة';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,'os@gmail.com','$2y$10$jPpIEO7AW9L8iHY9FBghNO9lWDtK2RblqgbHGTu8BpEtRyTdoWcY6',1,'active',NULL,3,'::1',NULL,NULL,'2026-08-12 21:05:32','2026-08-31 14:18:29',NULL),(2,1,'aaa@gmail.com','$2y$10$KNex3QobSALAwpVUyEFrDujG3gR/DL8hH9xvDAyqOkMosaCDTr0Pe',1,'active',NULL,3,'::1',NULL,NULL,'2026-08-12 21:17:58','2026-09-13 15:32:36',NULL),(3,2,'aaa2@gmail.com','$2y$10$2TexKD5/NIvVwTpLDf2zyeR2Sy.M4X/Sl0VK5YgYnzqPieRW7u8Lu',0,'pending',NULL,3,'::1',NULL,NULL,'2026-08-12 21:19:41','2026-08-31 14:21:48',NULL),(4,3,'a2@a.a','$2y$10$ddKML1U3QqFHp944ZnMt6OT/yWRoxrh9aUWzswzblzihPOz/xLpW2',0,'pending',NULL,3,'::1',NULL,NULL,'2026-08-12 21:20:55','2026-08-12 21:20:55',NULL),(5,4,'a3@a.a','$2y$10$GMNHIML0oVR2Qi5LqU9iuu2lbiqEHle/E2sXyQw7EZeDHbW96Mtj6',0,'pending',NULL,3,'::1',NULL,NULL,'2026-08-12 21:21:42','2026-08-12 21:21:42',NULL),(6,5,'a5@a.a','$2y$10$dnJrcDS9R/D0s0TD25ybGehm4USWEsTGhDz5O1b9tHBf0HIjq8UGi',0,'pending',NULL,3,'::1',NULL,NULL,'2026-08-12 21:22:46','2026-08-12 21:22:46',NULL),(9,1,'q@q.q','$2y$10$m3Z/4PwG5NexzSIMfIA4a.6/CCE9UVUGxDLwc7t1N2DVp38C/o2i.',0,'pending',NULL,3,'::1',NULL,NULL,'2026-08-13 01:33:32','2026-08-13 01:33:32',NULL),(11,10,'osamamalkhoun@gmail.com','$2y$10$36xSy68GVwpU/2LNFYg5F.L9HAAVjSrRActxn5SBG5EY/WyRixiRe',1,'active',NULL,3,'::1',NULL,NULL,'2026-08-13 01:43:17','2026-09-05 14:11:12',NULL),(12,2,'qwe@qwe.qwe','$2y$10$BvABVKzPEKLYVwqGDPzWAuvS6SZJVbi3u59gm9KhsXFOioECHtnEa',0,'pending',NULL,3,'::1',NULL,NULL,'2026-08-13 02:59:29','2026-08-13 02:59:29',NULL),(13,1,'qwe@qwe.qweaa','$2y$10$/YVBNGktXHEZiXHJugIoTeMG157q4Q/vEl0TXsZ2urbS56JOfTa/u',0,'pending',NULL,3,'::1',NULL,NULL,'2026-08-13 03:00:10','2026-08-13 03:00:10',NULL),(14,6,'xyz@xyz.xyz','$2y$10$yjGwK1ni0pjUG.IX5OvWi.fGalAwV28EbbIQDbUtsRBxXZf660xp2',0,'pending',NULL,3,'::1',NULL,NULL,'2026-08-13 03:02:53','2026-08-13 03:02:53',NULL),(15,2,'test@gmail.com','$2y$10$uB/tjv9BiLJiDOv4QoK09ecVKdI.SEvKP2zOrCGgewXfRFc/E0QX2',1,'active',NULL,3,'37.202.98.36',NULL,NULL,'2026-08-13 03:37:10','2026-08-31 14:18:29',NULL),(16,3,'suhaib@gmail.com','$2y$10$KNex3QobSALAwpVUyEFrDujG3gR/DL8hH9xvDAyqOkMosaCDTr0Pe',1,'active',NULL,3,'188.225.161.195',NULL,NULL,'2026-08-17 13:35:04','2026-09-13 15:32:36',NULL),(17,10,'afnan@gmail.com','$2y$10$Gls.pbSQJleOf4OnPppcvuZHUVfaN2MNP/g7HYFWTyIa5wXBwIC/u',1,'active',NULL,3,'212.34.12.125',NULL,NULL,'2026-08-17 13:56:37','2026-08-31 14:18:29',NULL),(18,5,'test-university@ris.local','$2y$10$.IA60kM3T3oVMWpU7e3Qbe6V4bTJ9UCGU1EUOFiuwyMrZYJqtRoku',1,'active','2026-08-19 19:34:20',1,NULL,NULL,NULL,'2026-08-19 19:34:20','2026-09-15 15:53:56',NULL),(20,2,'suhaib@aba.ps','$2y$10$KNex3QobSALAwpVUyEFrDujG3gR/DL8hH9xvDAyqOkMosaCDTr0Pe',1,'active',NULL,3,'::1',NULL,NULL,'2026-08-31 18:47:48','2026-09-13 15:32:36',NULL),(21,1,'test-undergrad-1788281356@ris.local','$2y$10$.IA60kM3T3oVMWpU7e3Qbe6V4bTJ9UCGU1EUOFiuwyMrZYJqtRoku',1,'active',NULL,3,'::1',NULL,NULL,'2026-09-01 16:49:16','2026-09-15 15:53:56',NULL),(22,2,'test-grad-1788281356@ris.local','$2y$10$XcdN88uLCQLmZaw14Z3Go.WTykweilliL0rPDVlN7cWycKY2ciqxS',0,'pending',NULL,3,'::1',NULL,NULL,'2026-09-01 16:49:17','2026-09-01 16:49:17',NULL),(23,3,'test-faculty-1788281356@ris.local','$2y$10$BRxtvl5i/hz0FwAYVFnTk.6R5C5X4tXEFAtolLrTM77Rsh51x1Ikm',0,'pending',NULL,3,'::1',NULL,NULL,'2026-09-01 16:49:17','2026-09-01 16:49:17',NULL),(24,4,'test-researcher-1788281356@ris.local','$2y$10$.IA60kM3T3oVMWpU7e3Qbe6V4bTJ9UCGU1EUOFiuwyMrZYJqtRoku',1,'active',NULL,3,'::1',NULL,NULL,'2026-09-01 16:49:17','2026-09-15 15:53:56',NULL),(25,9,'test-reviewer-1788281366@ris.local','$2y$10$KNex3QobSALAwpVUyEFrDujG3gR/DL8hH9xvDAyqOkMosaCDTr0Pe',1,'pending',NULL,3,'::1',NULL,NULL,'2026-09-01 16:49:26','2026-09-13 22:37:01',NULL),(26,5,'test-university2-1788281366@ris.local','$2y$10$sk2J7qFmqfkWZuGHeWzfaeazmCumwES6qhtNl5SLqBglILsrFhVLy',0,'pending',NULL,3,'::1',NULL,NULL,'2026-09-01 16:49:26','2026-09-01 16:49:26',NULL),(27,6,'test-college-1788281366@ris.local','$2y$10$KNex3QobSALAwpVUyEFrDujG3gR/DL8hH9xvDAyqOkMosaCDTr0Pe',1,'pending',NULL,3,'::1',NULL,NULL,'2026-09-01 16:49:26','2026-09-13 22:37:01',NULL),(28,7,'test-rescenter-1788281366@ris.local','$2y$10$KNex3QobSALAwpVUyEFrDujG3gR/DL8hH9xvDAyqOkMosaCDTr0Pe',1,'pending',NULL,3,'::1',NULL,NULL,'2026-09-01 16:49:26','2026-09-13 22:37:01',NULL),(29,8,'test-ministry-1788281366@ris.local','$2y$10$Z2omT6mVB9daOiwyoEAHtuePGTiOTi0QsK7NonyZrwiRVOxSVNmsi',1,'active',NULL,3,'::1',NULL,NULL,'2026-09-01 16:49:26','2026-09-15 18:30:49',NULL),(30,10,'test-employee-1788281366@ris.local','$2y$10$4nNX2STWlpU3ww7vuM5nruDWXTSq0T78yj7cAPQhfHocKHEAOwS32',0,'pending',NULL,3,'::1',NULL,NULL,'2026-09-01 16:49:26','2026-09-01 16:49:26',NULL),(31,1,'test-undergrad-1788281376@ris.local','$2y$10$Da7A0MIAc31PORxLSELfqu8aresDvvIS6c3FnnTPkm3c8.bi3elMu',0,'pending',NULL,3,'::1',NULL,NULL,'2026-09-01 16:49:37','2026-09-01 16:49:37',NULL),(32,14,'test-sp-ok-1788281404@ris.local','$2y$10$KNex3QobSALAwpVUyEFrDujG3gR/DL8hH9xvDAyqOkMosaCDTr0Pe',1,'active',NULL,3,'::1',NULL,NULL,'2026-09-01 16:50:04','2026-09-13 15:32:36',NULL),(33,14,'browser-sp-test-4529@ris.local','$2y$10$7GzJFG9g/0yQVXLC/weKHuWAopar8mkBORMmS1emoMAE941m0mYDi',1,'active',NULL,3,'::1',NULL,NULL,'2026-09-01 17:18:06','2026-09-01 17:18:57',NULL),(34,10,'suhaib1234@aba.ps','$2y$10$KNex3QobSALAwpVUyEFrDujG3gR/DL8hH9xvDAyqOkMosaCDTr0Pe',1,'pending',NULL,3,'::1',NULL,NULL,'2026-09-05 13:49:39','2026-09-13 15:32:36',NULL),(35,15,'admin@site.com','$2y$10$KNex3QobSALAwpVUyEFrDujG3gR/DL8hH9xvDAyqOkMosaCDTr0Pe',1,'active',NULL,3,'127.0.0.1',NULL,NULL,'2026-09-05 13:55:15','2026-09-13 15:32:36',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'ris'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-16 20:15:12
