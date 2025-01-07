import { redirect } from '@remix-run/node';
import { LoaderFunction } from 'react-router';

export default function Index() {
 return null
}


export const loader: LoaderFunction = async (args) => {
  return redirect('/account')
}