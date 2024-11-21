import React, { useEffect, useState } from 'react';
import { Table, Typography, Space, Tag, message } from 'antd';
import { getHospitalDetails } from '../../api/hospitalAPI';

const { Title } = Typography;

const List = ({ hospitalSub }) => {
    const [hospitalDetails, setHospitalDetails] = useState(null);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        if (!hospitalSub) {
            console.error('No hospital identifier (sub) provided');
            return;
        }

        // Fetch hospital data
        const fetchHospitalData = async () => {
            try {
                const response = await getHospitalDetails(hospitalSub);
                setHospitalDetails(response.data);
            } catch (error) {
                console.error('Error fetching hospital details:', error);
                message.error('병원 정보를 불러오는 중 오류가 발생했습니다.');
            }
        };

        // Fetch patients data
        const fetchPatients = async () => {
            try {
                const API_URL = process.env.REACT_APP_BASE_URL;
                const response = await fetch(`${API_URL}api/hospital/patients`);
                const data = await response.json();
                setPatients(data.patients || []);
            } catch (error) {
                console.error('Error fetching patients:', error);
                message.error('환자 데이터를 불러오는 중 오류가 발생했습니다.');
            }
        };

        fetchHospitalData();
        fetchPatients();
    }, [hospitalSub]);

    // Define columns for the Ant Design Table
    const columns = [
        {
            title: '이름',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '나이',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '성별',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: '중증도',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag
                    color={
                        status === 'red'
                            ? 'red'
                            : status === 'white'
                                ? 'default'
                                : 'gray'
                    }
                >
                    {status === 'red'
                        ? '심각'
                        : status === 'white'
                            ? '경미'
                            : '보통'}
                </Tag>
            ),
        },
        {
            title: '증상',
            dataIndex: 'symptoms',
            key: 'symptoms',
        },
        {
            title: '복용약',
            dataIndex: 'medication',
            key: 'medication',
        },
        {
            title: '특이사항',
            dataIndex: 'notes',
            key: 'notes',
        },
        {
            title: '전화번호',
            dataIndex: 'phone',
            key: 'phone',
        },
    ];

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {/* Header Section */}
            <Title level={3}>
                응급실 목록 화면 -{' '}
                {hospitalDetails ? hospitalDetails.name : '병원 이름 불러오는 중'}
            </Title>

            {/* Patient List Section */}
            <Table
                dataSource={patients}
                columns={columns}
                rowKey={(record) => record.name} // Use unique identifier for rows
                bordered
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: '등록된 환자가 없습니다.' }}
            />
        </Space>
    );
};

export default List;
