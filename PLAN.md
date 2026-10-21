# Project Analysis and Implementation Plan

## Overview
The project is a full-stack Next.js/Express web application ("Learn & Grow").

## Implementation Plan

### 1. Fix Category Dropdown (Problem 3.1)
- **Location**: `learn-grow/app/admin/courses/edit/page.tsx`
- **Fix**: Correctly handle the API response structure where `data` might be nested in an object.
- **Current**: `const categories = Array.isArray(categoriesData) ? categoriesData : [];`
- **Proposed**: Update to safely handle `{ success: true, data: [...] }`.

### 2. Fix Missing Thumbnail in Admin (Problem 3.2)
- **Location**: `learn-grow/app/admin/courses/edit/page.tsx`
- **Fix**: Update the thumbnail preview logic to check the actual data field properly even if it is not in the course object directly.

### 3. Title Language Synchronization (Problem 3.3)
- **Location**: `learn-grow/app/admin/courses/edit/page.tsx`
- **Proposed**: Add a toggle or logic to handle bilingual titles. If saving, we must ensure we are not overwriting a Bengali title if the user is not specifically editing it as English.

### 4. Fix Mentor Credential Truncation (Problem 3.4)
- **Location**: `learn-grow/components/courses/CourseDetails.tsx`
- **Fix**: Adjust CSS classes (`truncate` vs `line-clamp`) to prevent abrupt cutoff.

### 5. Add Coupon Code Functionality
- **Backend**: Need to add a Coupon model, controller, and routes in `grow-backend/`.
- **Frontend**: Add a coupon input field in the Checkout flow. Update state management to validate/apply coupons.
- **Admin/Manager Dashboard**: Add a new view/page to CRUD coupons.

## Next Steps
- I will start by fixing the Category dropdown issue.
- Then I will address the Thumbnail preview and Title sync.
- Then CSS truncation fix.
- Finally, the coupon code system.
