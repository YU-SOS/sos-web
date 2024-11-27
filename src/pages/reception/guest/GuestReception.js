import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import apiClient from '../../../api/apiClient';
import Loading from '../../../components/Loading';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

const GuestReception = () => {
    const { receptionNumber } = useParams();
    const [hospital, setHospital] = useState();
    const [ambulance, setAmbulance] = useState();
    const [patient, setPatient] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReception = async () => {
            try {
                const response = await apiClient.get(`/reception/${receptionNumber}/guest`);
                const data = response.data.data;

                console.log(data);
                setHospital(data.hospital);
                setAmbulance(data.ambulance);
                setPatient(data.patient);

                setIsLoading(false);
            } catch (err) {
                console.error(err);
            }
        };

        fetchReception();
    }, [receptionNumber]);

    if (isLoading) {
        return (
            <LoadingWrapper>
                <Loading />
            </LoadingWrapper>
        );
    }

    return (
        <Wrapper>
            <Header>SOS</Header>
            <MapContainer>
                <Map
                    center={{
                        lat: parseFloat(hospital.location.latitude),
                        lng: parseFloat(hospital.location.longitude),
                    }}
                    style={{ width: '100%', height: '100%' }}
                    level={3}
                >
                    <MapMarker
                        position={{
                            lat: parseFloat(hospital.location.latitude),
                            lng: parseFloat(hospital.location.longitude),
                        }}
                    >
                    </MapMarker>
                </Map>
            </MapContainer>

            <Content>
                <SubTitleContainer>
                    <SubTitle>병원 정보</SubTitle>
                </SubTitleContainer>

                <Container>
                    <Category>병원명</Category>
                    <p>{hospital.name}</p>
                </Container>

                <Container>
                    <Category>병원 주소</Category>
                    <p>{hospital.address}</p>
                </Container>

                <Container>
                    <Category>병원 전화번호</Category>
                    <p>{hospital.telephoneNumber}</p>
                </Container>

                <StyledHr />

                <SubTitleContainer>
                    <SubTitle>환자 정보</SubTitle>
                </SubTitleContainer>

                <Container>
                    <Category>이름</Category>
                    <p>{patient.name}</p>
                </Container>

                <Container>
                    <Category>나이</Category>
                    <p>{patient.age}</p>
                </Container>

                <Container>
                    <Category>전화번호</Category>
                    <p>{patient.phoneNumber}</p>
                </Container>

                <Container>
                    <Category>증상</Category>
                    <p>{patient.symptom}</p>
                </Container>
            </Content>
        </Wrapper>
    );
};

const LoadingWrapper = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
`;

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
`;

const Header = styled.div`
    height: 60px;
    border-bottom: 0.5px solid #dfdfdf;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 15px;
    font-family: 'Jockey One', sans-serif;
    font-size: 35px;
    font-weight: 600;
`;

const MapContainer = styled.div`
    width: 100%;
    height: 200px;
`;

const Content = styled.div`
    box-sizing: border-box;
    padding: 15px;
    display: flex;
    flex-direction: column;
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

const SubTitleContainer = styled.div`
    display: flex;
    justify-content: end;
`;

const SubTitle = styled.p`
    font-size: 25px;
    font-weight: 600;
    padding: 0 0 3px 0;
    margin-bottom: 20px;
    text-align: right;
    border-bottom: 1px solid #dfdfdf;
`;

const Category = styled.div`
    font-size: 20px;
    font-weight: 600;
`;

const StyledHr = styled.div`
    height: 0.2px;
    background-color: #d1d1d1;
    margin-top: 20px;
    margin-bottom: 20px;
`;

export default GuestReception;
