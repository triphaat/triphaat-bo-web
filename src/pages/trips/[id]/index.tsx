import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../libs/auth';
import GenericFormGenerator from '../../../components/global/GenericFormGenerator';
import GenericViewGenerator from '../../../components/global/GenericViewGenerator';
import { getLocations, getTrip, getVendors } from '../../../apis';
import { getGeneralStatusOptions } from '../../../utils';
import { callPostApi } from '../../../libs/api';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Details | Trip Management', () => {
        const tripId = context.query.id;

        // console.debug({ roleId });

        return {
            tripId,
        };
    });

const Page = ({ tripId }: { tripId: string }) => {
    const router = useRouter();

    const [vendors, setVendors] = useState(null);
    const [locations, setLocations] = useState(null);
    const [trip, setTrip] = useState(null);

    useEffect(() => {
        getVendors()
            .then(response => {
                if (!response) {
                    // showToast('error', 'Unsuccessful!', 'Server not working!');
                } else if (response.statusCode !== 200) {
                    // showToast('error', 'Unsuccessful!', response.message);
                } else {
                    // showToast('success', 'Success!', response.message);

                    setVendors(response.data);
                }
            })
            .catch(error => {
                console.error('error', error);

                // showToast('error', 'Unsuccessful!', 'Something went wrong!');
            })
            .finally(() => {});

        getLocations()
            .then(response => {
                if (!response) {
                    // showToast('error', 'Unsuccessful!', 'Server not working!');
                } else if (response.statusCode !== 200) {
                    // showToast('error', 'Unsuccessful!', response.message);
                } else {
                    // showToast('success', 'Success!', response.message);

                    setLocations(response.data);
                }
            })
            .catch(error => {
                console.error('error', error);

                // showToast('error', 'Unsuccessful!', 'Something went wrong!');
            })
            .finally(() => {});

        getTrip(tripId)
            .then(response => {
                if (!response) {
                    // showToast('error', 'Unsuccessful!', 'Server not working!');
                } else if (response.statusCode !== 200) {
                    // showToast('error', 'Unsuccessful!', response.message);
                } else {
                    // showToast('success', 'Success!', response.message);

                    setTrip(response.data);
                }
            })
            .catch(error => {
                console.error('error', error);

                // showToast('error', 'Unsuccessful!', 'Something went wrong!');
            })
            .finally(() => {});
    }, []);

    return (
        <>
            <Card title={trip?.name} className="mb-3">
                <TabView
                    activeIndex={0}
                    onTabChange={e => {
                        // if (e.index === 0) router.push(`/trips/${tripId}`);
                        if (e.index === 1) router.push(`/trips/${tripId}/variants`);
                        if (e.index === 2) router.push(`/trips/${tripId}/images`);
                        if (e.index === 3) router.push(`/trips/${tripId}/videos`);
                        if (e.index === 4) router.push(`/trips/${tripId}/tags`);
                    }}
                >
                    <TabPanel header="Details">
                        {useMemo(
                            () =>
                                !trip ? null : (
                                    <GenericFormGenerator
                                        datum={{
                                            ...trip,
                                            startDate: trip.startDate.split('T')[0],
                                            endDate: trip.endDate.split('T')[0],
                                        }}
                                        fields={[
                                            {
                                                type: 'select-sync',
                                                name: 'vendorId',
                                                placeholder: 'Select a vendor!',
                                                title: 'Vendor',
                                                initialValue: null,
                                                options: _.map(
                                                    vendors,
                                                    (vendor: {
                                                        id: number;
                                                        businessName: string;
                                                        phone: string;
                                                        email: string;
                                                    }) => ({
                                                        value: vendor.id,
                                                        label:
                                                            vendor.businessName +
                                                            ' ' +
                                                            vendor.phone +
                                                            ' ' +
                                                            vendor.email,
                                                    })
                                                ),
                                                validate: (values: any) => {
                                                    if (!values.vendorId) return 'Required!';

                                                    return null;
                                                },
                                            },
                                            {
                                                type: 'hidden',
                                                name: 'type',
                                                placeholder: '',
                                                title: '',
                                                initialValue: 'PRE_ARRANGED',
                                                validate: (values: any) => {
                                                    if (!values.type) return 'Required!';

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
                                                type: 'select-sync',
                                                name: 'locationName',
                                                placeholder: 'Select a location for trip!',
                                                title: 'Location Name',
                                                initialValue: null,
                                                options: _.map(
                                                    locations,
                                                    (location: {
                                                        name: string;
                                                        city: string;
                                                        state: string;
                                                        country: string;
                                                    }) => ({
                                                        value: location.name,
                                                        label:
                                                            location.name +
                                                            ' ' +
                                                            location.city +
                                                            ' ' +
                                                            location.state +
                                                            ' ' +
                                                            location.country,
                                                    })
                                                ),
                                                validate: (values: any) => {
                                                    if (!values.locationName) return 'Required!';

                                                    return null;
                                                },
                                            },
                                            {
                                                type: 'textarea',
                                                name: 'smallDescription',
                                                placeholder: 'Enter small description for this trip!',
                                                title: 'Small Description',
                                                initialValue: null,
                                                validate: (values: any) => {
                                                    if (!values.smallDescription) return 'Required!';

                                                    return null;
                                                },
                                            },
                                            {
                                                type: 'richtext',
                                                name: 'bigDescription',
                                                placeholder: 'Enter big description for this trip!',
                                                title: 'Big Description',
                                                initialValue: null,
                                                validate: (values: any) => {
                                                    if (!values.bigDescription) return 'Required!';

                                                    return null;
                                                },
                                            },
                                            {
                                                type: 'number',
                                                name: 'durationInDays',
                                                placeholder: 'Enter duration in days this trip!',
                                                title: 'Duration In Days',
                                                initialValue: null,
                                                validate: (values: any) => {
                                                    if (!values.durationInDays) return 'Required!';

                                                    return null;
                                                },
                                            },
                                            {
                                                type: 'number',
                                                name: 'durationInNights',
                                                placeholder: 'Enter duration in nights for this trip!',
                                                title: 'Duration In Nights',
                                                initialValue: null,
                                                validate: (values: any) => {
                                                    if (!values.durationInNights) return 'Required!';

                                                    return null;
                                                },
                                            },
                                            {
                                                type: 'date',
                                                name: 'startDate',
                                                placeholder: 'Enter start date for this trip!',
                                                title: 'Start Date',
                                                initialValue: null,
                                                validate: (values: any) => {
                                                    if (!values.startDate) return 'Required!';

                                                    return null;
                                                },
                                            },
                                            {
                                                type: 'date',
                                                name: 'endDate',
                                                placeholder: 'Enter end date for this trip!',
                                                title: 'End Date',
                                                initialValue: null,
                                                validate: (values: any) => {
                                                    if (!values.endDate) return 'Required!';

                                                    return null;
                                                },
                                            },
                                            {
                                                type: 'number',
                                                name: 'numberOfSeats',
                                                placeholder: 'Enter number of seats for this trip!',
                                                title: 'Number of Seats (Maximum)',
                                                initialValue: null,
                                                validate: (values: any) => {
                                                    if (!values.numberOfSeats) return 'Required!';

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
                                                validate: (values: any) => {
                                                    if (!values.status) return 'Required!';

                                                    return null;
                                                },
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
                                        ]}
                                        callback={(data, callback) => {
                                            // console.debug({ data });

                                            callPostApi('/api/v1/trips', data)
                                                .then(response => {
                                                    if (!response) {
                                                        // showToast('error', 'Unsuccessful!', 'Server not working!');
                                                    } else if (response.statusCode !== 200) {
                                                        // showToast('error', 'Unsuccessful!', response.message);
                                                    } else {
                                                        callback();

                                                        // showToast('success', 'Success!', response.message);
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
                            [trip]
                        )}
                    </TabPanel>
                    <TabPanel header="Variants"></TabPanel>
                    <TabPanel header="Images"></TabPanel>
                    <TabPanel header="Videos"></TabPanel>
                    <TabPanel header="Tags"></TabPanel>
                </TabView>
            </Card>
        </>
    );
};

export default Page;
