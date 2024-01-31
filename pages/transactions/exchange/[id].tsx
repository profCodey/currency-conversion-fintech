import { AppLayout } from '@/layout/common/app-layout';
import { ExchangeHistory } from '@/layout/transactions/exchange-history';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import Cookies from 'js-cookie';

const NairaTransactionPage = () => {

     let colorPrimary = Cookies.get("primary_color") ? Cookies.get("primary_color") : "#132144";

  const router = useRouter();
  const fx = router.query["id"] as string;
  return (
    <div>
      <div className="text-primary-100">
        <h2 className={"text-2xl font-secondary mt-2"} style={{ color: colorPrimary }}>Transactions</h2>
        <span style={{ color: colorPrimary }}>View Different Transaction Histories</span>
      </div>
      <section className='mt-0'>
        <ExchangeHistory/>
      </section>
    </div>
  )
}

export default NairaTransactionPage

NairaTransactionPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};