import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../../libs/auth';
import GenericFormGenerator, { IField } from '../../../../../components/global/GenericFormGenerator';
import { getLocations } from '../../../../../apis';
import { getGeneralStatusOptions, getTripGeneralTypeOptions, getTripType } from '../../../../../utils';
import { callPostApi } from '../../../../../libs/api';
import handleResponseIfError from '../../../../../utils/responseHandler';
import { ILocation } from '../../../../../types';

export const getTripFields = (
    dateType: string,
    accommodationType: string,
    transportationType: string,
    foodType: string,
    type: string,
    generalTypes: { value: string; label: string }[],
    locations: ILocation[]
): IField[] => [
    {
        type: 'select-sync',
        name: 'generalType',
        placeholder: 'Select a type in general',
        title: 'General Type',
        initialValue: null,
        options: generalTypes,
        isSearchable: true,
        isClearable: true,
        show: () => {
            if (type === '1111') return true;

            return false;
        },
        validate: (values: any) => {
            if (type === '1111' && !values.generalType) return 'Required!';

            return null;
        },
    },
    {
        type: 'text',
        name: 'generalTypeOther',
        placeholder: 'Enter general type (if other)',
        title: 'General Type (if other)',
        initialValue: null,
        show: () => {
            if (type === '1111') return true;

            return false;
        },
        validate: (values: any) => {
            if (type === '1111' && values.generalType === 'OTHER' && !values.generalTypeOther)
                return 'Please specify what type of item is this you are trying to create?';

            return null;
        },
    },
    {
        type: 'select-sync',
        name: 'locationId',
        placeholder: 'Select a location for trip!',
        title: 'Location',
        initialValue: null,
        options: _.map(locations, (location: ILocation) => ({
            value: location.id,
            label: `${location.name}, ${location?.city?.name}, ${location?.city?.state?.name}, ${location?.city?.state?.country?.name}`,
        })),
        isSearchable: true,
        isClearable: false,
        validate: (values: any) => {
            if (!values.locationId) return 'Required!';

            return null;
        },
    },
    {
        type: 'hidden',
        name: 'dateType',
        placeholder: '',
        title: '',
        initialValue: dateType,
        validate: (values: any) => {
            if (!values.dateType) return 'Required!';

            return null;
        },
    },
    {
        type: 'hidden',
        name: 'accommodationType',
        placeholder: '',
        title: '',
        initialValue: accommodationType,
        validate: (values: any) => {
            if (!values.accommodationType) return 'Required!';

            return null;
        },
    },
    {
        type: 'hidden',
        name: 'transportationType',
        placeholder: '',
        title: '',
        initialValue: transportationType,
        validate: (values: any) => {
            if (!values.transportationType) return 'Required!';

            return null;
        },
    },
    {
        type: 'hidden',
        name: 'foodType',
        placeholder: '',
        title: '',
        initialValue: foodType,
        validate: (values: any) => {
            if (!values.foodType) return 'Required!';

            return null;
        },
    },
    {
        type: 'text',
        name: 'name',
        placeholder: 'Enter trip name!',
        title: 'Name',
        initialValue: null,
        validate: (values: any) => {
            if (!values.name) return 'Required!';

            return null;
        },
    },
    {
        type: 'textarea',
        name: 'smallDescription',
        placeholder: 'Enter small description for this trip!',
        title: 'Small Description',
        initialValue: null,
    },
    {
        type: 'richtext',
        name: 'bigDescription',
        placeholder: 'Enter big description for this trip!',
        title: 'Big Description',
        initialValue: null,
    },
    {
        type: 'number',
        name: 'durationInDays',
        placeholder: 'Enter duration in days this trip!',
        title: 'Duration In Days',
        initialValue: null,
        show: () => {
            if (type === '2260') return false;

            return true;
        },
        validate: (values: any) => {
            if (type === '0000' && !values.durationInDays) return 'Required!';

            return null;
        },
        col: 2,
    },
    {
        type: 'number',
        name: 'durationInNights',
        placeholder: 'Enter duration in nights for this trip!',
        title: 'Duration In Nights',
        initialValue: null,
        show: () => {
            if (type === '2260') return false;

            return true;
        },
        validate: (values: any) => {
            if (type === '0000' && !values.durationInNights) return 'Required!';

            return null;
        },
    },
    {
        type: 'date',
        name: 'startDate',
        placeholder: 'Enter start date for this trip!',
        title: 'Start Date',
        initialValue: null,
        minDate: new Date(),
        show: () => {
            if (type === '2260') return false;

            return true;
        },
        validate: (values: any) => {
            if (type === '0000' && !values.startDate) return 'Required!';

            return null;
        },
        col: 3,
    },
    {
        type: 'date',
        name: 'endDate',
        placeholder: 'Enter end date for this trip!',
        title: 'End Date',
        initialValue: null,
        minDate: new Date(),
        show: () => {
            if (type === '2260') return false;

            return true;
        },
        validate: (values: any) => {
            if (type === '0000' && !values.endDate) return 'Required!';

            return null;
        },
    },
    {
        type: 'date',
        name: 'expiryDateOfBooking',
        placeholder: 'Enter date of expiration for this trip!',
        title: 'Expiration Date Of Booking',
        initialValue: null,
        show: () => {
            if (type === '2260') return false;

            return true;
        },
        validate: (values: any) => {
            if (type === '0000' && !values.expiryDateOfBooking) return 'Required!';

            return null;
        },
    },
    {
        type: 'number',
        name: 'numberOfSeats',
        placeholder: 'Enter number of seats for this trip!',
        title: 'Number of Seats (Maximum pax possible)',
        initialValue: null,
        validate: (values: any) => {
            if ((type === '0000' || type === '2260') && !values.numberOfSeats) return 'Required!';

            return null;
        },
        col: 3,
    },
    {
        type: 'number',
        name: 'minRequiredSeatsToRun',
        placeholder: 'Enter number of seats required for this trip to run!',
        title: 'Number of Seats (Minimum pax required)',
        initialValue: null,
        validate: (values: any) => {
            if ((type === '0000' || type === '2260') && !values.minRequiredSeatsToRun) return 'Required!';

            if ((type === '0000' || type === '2260') && values.numberOfSeats < values.minRequiredSeatsToRun)
                return "You can't input a value greater the maximum number of seats!";

            return null;
        },
    },
    {
        type: 'select-sync',
        name: 'isVisaRequired',
        placeholder: 'Select VISA requirements!',
        title: 'Visa Requirements',
        initialValue: false,
        options: [
            {
                value: true,
                label: 'Visa Required',
            },
            {
                value: false,
                label: 'Visa Not Required',
            },
        ],
        show: () => {
            if (type === '2260') return false;

            return true;
        },
        validate: (values: any) => {
            if (!values.status) return 'Required!';

            return null;
        },
    },
    {
        type: 'number',
        name: 'serial',
        placeholder: 'Enter serial number for sorting!',
        title: 'Serial',
        initialValue: 9999,
        validate: (values: any) => {
            if (!values.serial) return 'Required!';

            return null;
        },
        col: 2,
    },
    {
        type: 'select-sync',
        name: 'status',
        placeholder: 'Select status!',
        title: 'Status',
        initialValue: 'ACTIVE',
        options: getGeneralStatusOptions(),
        validate: (values: any) => {
            if (!values.status) return 'Required!';

            return null;
        },
    },
];

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Create A Trip | Trip Management', async cookies => {
        const responseGetLocations = await getLocations(`${cookies.accessType} ${cookies.accessToken}`);

        const responseError = handleResponseIfError(context, responseGetLocations);
        if (responseError !== null) return responseError;

        return {
            isVendor: true,
            locations: responseGetLocations.data,
        };
    });

const Page = ({ locations }: { locations: ILocation[] }) => {
    const router = useRouter();

    const types = getTripType(router);

    return (
        <Card title="Create A Trip">
            {useMemo(
                () =>
                    !locations || _.size(locations) === 0 ? null : (
                        <GenericFormGenerator
                            fields={getTripFields(
                                types.dateType,
                                types.accommodationType,
                                types.transportationType,
                                types.foodType,
                                router.query.type as string,
                                getTripGeneralTypeOptions,
                                locations
                            )}
                            callback={(data, resetForm) => {
                                // console.debug({ data });

                                callPostApi('/vendor/api/v1/trips', data, null, null, true)
                                    .then(response => {
                                        if (!response) {
                                            // showToast('error', 'Unsuccessful!', 'Server not working!');
                                        } else if (response.statusCode !== 200) {
                                            // showToast('error', 'Unsuccessful!', response.message);
                                        } else {
                                            if (resetForm) resetForm();

                                            // showToast('success', 'Success!', response.message);

                                            router.push(
                                                `/v-p/trips/${response.data.id}/t/${router.query.type as string}`
                                            );
                                        }
                                    })
                                    .catch(error => {
                                        console.error('error', error);

                                        // showToast('error', 'Unsuccessful!', 'Something went wrong!');
                                    })
                                    .finally(() => {});
                            }}
                            submitButtonText="Save"
                        />
                    ),
                [locations]
            )}
        </Card>
    );
};

export default Page;
