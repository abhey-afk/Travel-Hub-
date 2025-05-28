import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../features/auth/authSlice';

const Profile = () => {
    const user = useSelector(selectCurrentUser);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-red-500">Please log in to view your profile</div>
            </div>
        );
    }

    // Destructure user data for easier access
    const {
        name,
        email,
        phone,
        role,
        country,
        state,
        city,
        pincode,
        createdAt
    } = user;

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Not available';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Not available';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg">
                    {/* Profile Header */}
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Profile Information
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Personal details and location information.
                        </p>
                    </div>

                    {/* Profile Details */}
                    <div className="px-4 py-5 sm:p-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                            {/* Personal Information */}
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                                <dd className="mt-1 text-sm text-gray-900">{name}</dd>
                            </div>

                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                                <dd className="mt-1 text-sm text-gray-900">{email}</dd>
                            </div>

                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                                <dd className="mt-1 text-sm text-gray-900">{phone}</dd>
                            </div>

                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Role</dt>
                                <dd className="mt-1 text-sm text-gray-900 capitalize">{role}</dd>
                            </div>

                            {/* Location Information */}
                            <div className="sm:col-span-2">
                                <h4 className="text-sm font-medium text-gray-500 mb-4">Location Details</h4>
                                <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Country</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{country || 'Not provided'}</dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">State</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{state || 'Not provided'}</dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">City</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{city || 'Not provided'}</dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Pincode</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{pincode || 'Not provided'}</dd>
                                    </div>
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="sm:col-span-2">
                                <h4 className="text-sm font-medium text-gray-500 mb-4">Account Information</h4>
                                <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Member since</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {formatDate(createdAt)}
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 