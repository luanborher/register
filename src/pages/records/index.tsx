import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { MoreHorizontal } from 'lucide-react';

import Header from "@/components/Header/Header";
import Search from '@/components/Search/Search';
import TableComponent from '@/components/Table/Table';
import Modal from '@/components/Modal/Modal';
import ClientsDetails from '@/components/ClientsDetails/ClientsDetails';
import RootLayout from '@/components/RootLayout/Layout';

import api from '@/services/api';

import { Records, Paginated, RecordsFilter } from '@/interfaces/Records';

import { Content } from './styles';

export default function IndexPage() {
  const [clientsList, setClientsList] = useState<Records[]>([]);
  const [clientSelected, setClientSelected] = useState<Records | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const { register, control, getValues } = useForm<RecordsFilter>();

  const getClients = async () => {
    try {
      const { data } = await api.get<Paginated<Records[]>>('/client/filter/validated', {
        params: {
          page: 1,
          limit: 10,
          name: getValues('name'),
        }
      });

      setClientsList(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  const openDetails = (client: Records) => {
    setClientSelected(client);
    setShowDetails(true);
  };

  const renderStatus = (status: string) => {
    const statusList = {
      VALIDATED: 'Validado',
      IN_REVIEW: 'Em revisão',
      REJECTED: 'Rejeitado'
    } as any;

    return statusList[status || 'IN_REVIEW'];
  }

  const renderColors = (status: string) => {
    const colors = {
      VALIDATED: '#14dd46',
      IN_REVIEW: '#008cff',
      REJECTED: '#ff0000',
    } as any;

    return colors[status || 'IN_REVIEW'];
  }

  return (
    <RootLayout>
      <main className="flex flex-col gap-2 h-full">
        <Header
          title="Cadastros"
          subtitle="Primeira ligação, validação de cadastro e correções de dados."
          action
        />

        <Search register={register} onSubmit={getClients} />

        <Content>
          <TableComponent
            headers={[
              'Nome',
              'CPF',
              'Endereço',
              'Comunidade',
              'Contrato',
              'Status',
              'Ações'
            ]}
          >
            {clientsList?.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => openDetails(row)}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                className="hover:opacity-80 cursor-pointer border-b-2 border-shadow hover:bg-shadow scroll"
              >
                <TableCell align="left" height={55} className="p-0">
                  <div>{row.name || '-- --'}</div>
                </TableCell>

                <TableCell align="left" height={55} className="p-0">
                  <div>{row.cpf || '___.___.___-__'}</div>
                </TableCell>

                <TableCell align="left" height={55} className="p-0">
                  <div>
                    {row.property.street.name || ''}, {row.property.number || ''}
                  </div>
                </TableCell>

                <TableCell align="left" className="p-0">
                  <div>{row.property.street.community.name || ''}</div>
                </TableCell>

                <TableCell align="left" className="p-0">
                  <div>{row.property.street.community.contract.name || ''}</div>
                </TableCell>

                <TableCell align="left" height={55} className="p-0">
                  <div style={{ color: renderColors(row.status) }}>
                    {renderStatus(row.status)}
                  </div>
                </TableCell>

                <TableCell align="right" width={40} className="p-0">
                  <MoreHorizontal size={24} className="text-secondary self-end" />
                </TableCell>
              </TableRow>
            ))}
          </TableComponent>
        </Content>

        {showDetails && clientSelected && (
          <Modal>
            <ClientsDetails
              client={clientSelected}
              onClose={() => setShowDetails(false)}
            />
          </Modal>
        )}
      </main>
    </RootLayout>
  );
}
