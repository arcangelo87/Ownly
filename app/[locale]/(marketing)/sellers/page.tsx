import { redirect } from 'next/navigation';

type Props = { params: { locale: string } };

export default function SellersPage({ params }: Props) {
  redirect(`/${params.locale}`);
}
