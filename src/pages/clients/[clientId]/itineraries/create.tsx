import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../libs/auth';
import GenericFormGenerator, { IField } from '../../../../components/global/GenericFormGenerator';
import { getTripFields } from '../../../v-p/trips/t/[type]/create';
import { getCategories, getLocations } from '../../../../apis';
import { getTripGeneralTypeOptions, getTripType } from '../../../../utils';
import { callPostApi } from '../../../../libs/api';
import handleResponseIfError from '../../../../utils/responseHandler';
import { ICategory, ILocation } from '../../../../types';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Create A Itinerary', async cookies => {
        const clientId = context.query.clientId as string;

        const responseGetLocations = await getLocations(`${cookies.accessType} ${cookies.accessToken}`);

        const responseError = handleResponseIfError(context, responseGetLocations);
        if (responseError !== null) return responseError;

        return {
            isVendor: false,
            clientId: parseInt(clientId),
            locations: responseGetLocations.data,
        };
    });

const Page = ({ clientId, locations }: { clientId: number; locations: ILocation[] }) => {
    const router = useRouter();
    console.debug({ router });

    const types = {
        dateType: 'UNFIXED',
        accommodationType: 'UNFIXED',
        transportationType: 'UNFIXED',
        foodType: 'UNFIXED',
    };

    return (
        <Card title="Create An Itinerary">
            {useMemo(
                () =>
                    !locations || _.size(locations) === 0 ? null : (
                        <GenericFormGenerator
                            fields={getTripFields(
                                types.dateType,
                                types.accommodationType,
                                types.transportationType,
                                types.foodType,
                                '1111',
                                getTripGeneralTypeOptions,
                                locations
                            )}
                            callback={(data, resetForm) => {
                                console.debug({ data });

                                callPostApi('/api/v1/trips', { ...data, clientId }, null, null, true)
                                    .then(response => {
                                        if (!response) {
                                            // showToast('error', 'Unsuccessful!', 'Server not working!');
                                        } else if (response.statusCode !== 200) {
                                            // showToast('error', 'Unsuccessful!', response.message);
                                        } else {
                                            if (resetForm) resetForm();

                                            // showToast('success', 'Success!', response.message);

                                            router.push('/');
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
