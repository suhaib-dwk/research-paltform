import ReviewsPage from './ReviewsPage';

// ✅ سجل التحكيمات المكتملة — يعيد استخدام نفس مكونات ReviewsPage البصرية
// بفلتر status=completed بدل pending/in_progress
const ReviewsHistoryPage = () => <ReviewsPage statusFilter="completed" />;

export default ReviewsHistoryPage;
