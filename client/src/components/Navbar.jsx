import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className='bg-slate-900 text-white px-6 py-4 flex justify-between items-center'>
      <Link to='/' className='text-xl font-bold text-blue-400'>HireGrid</Link>
      <div className='flex gap-4 items-center'>
        <SignedIn>
          <Link to='/dashboard' className='hover:text-blue-400'>Dashboard</Link>
          <Link to='/applications' className='hover:text-blue-400'>Applications</Link>
          <UserButton afterSignOutUrl='/' />
        </SignedIn>
        <SignedOut>
          <SignInButton mode='modal'>
            <button className='bg-blue-500 px-4 py-2 rounded hover:bg-blue-600'>
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  )
}