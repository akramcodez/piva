'use server';

import { WebinarFormState } from '@/store/useWebinarStore';
import { onAuthenticateUser } from './auth';

export const createWebinar = async (formData: WebinarFormState) => {
  try {
    const user = await onAuthenticateUser();
    if (!user) {
      return { status: 401, message: 'Unauthorized' };
    }

    // todo
    // if(!user.user?.subscription) {
    //     return { status: 403, message: "Subcription Required" }
    // }

    const presenterId = user.user?.id;
    console.log('Form Data', formData, presenterId);

    if (!formData.basicInfo.webinarName) {
      return { status: 400, message: 'Webinar Name is required' };
    }

    if (!formData.basicInfo.date) {
      return { status: 400, message: 'Webinar Date is required' };
    }

    if (!formData.basicInfo.time) {
      return { status: 400, message: 'Webinar Time is required' };
    }

    const combinedDataTime = combineDatTime(
      formData.basicInfo.date,
      formData.basicInfo.time,
      formData.basicInfo.timeFormet || 'AM',
    );
    console.log('Combined Data Time', combinedDataTime);
  } catch (error) {}
};
