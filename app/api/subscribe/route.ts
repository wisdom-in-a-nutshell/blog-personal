import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Ensure the API key is loaded from environment variables
const resend = new Resend(process.env.RESEND_API_KEY)
// Ensure the Audience ID is loaded from environment variables
const audienceId = process.env.RESEND_AUDIENCE_ID

/**
 * Handles POST requests to subscribe a user to the Resend audience.
 *
 * Expects a JSON body with an "email" property.
 * Validates the email and adds the contact to the configured Resend audience.
 *
 * @export
 * @param {Request} request The incoming request object.
 * @returns {Promise<NextResponse>} A response indicating success or failure.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Check if environment variables are set
    if (!process.env.RESEND_API_KEY) {
      console.error('Resend API Key is not configured.')
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 })
    }
    if (!audienceId) {
      console.error('Resend Audience ID is not configured.')
      return NextResponse.json({ error: 'Audience ID not configured.' }, { status: 500 })
    }

    // Parse the request body to get the email
    const { email } = await request.json()

    // Basic email validation
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email provided.' }, { status: 400 })
    }

    // Add the contact to the Resend audience
    const { data, error } = await resend.contacts.create({
      email: email,
      audienceId: audienceId,
      unsubscribed: false, // Ensure new subscribers are marked as subscribed
    })

    // Handle potential errors from Resend API
    if (error) {
      console.error('Resend API error:', error)
      // Provide a more user-friendly error message based on common Resend errors
      if (error.name === 'validation_error') {
        return NextResponse.json(
          { error: 'Invalid email format according to Resend.' },
          { status: 400 }
        )
      }
      if (error.message.includes('already exists')) {
        // If the contact already exists, treat it as a success for the user
        // Optionally, you could update the contact if needed, but for a simple subscribe, this is fine.
        console.log(
          `Contact ${email} already exists in audience ${audienceId}. Treating as success.`
        )
        return NextResponse.json({ message: 'Contact already subscribed.' }, { status: 200 })
      }
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again later.' },
        { status: 500 }
      )
    }

    // Return a success response
    return NextResponse.json(
      { message: 'Successfully subscribed!', contact: data },
      { status: 201 }
    )
  } catch (err) {
    // Handle unexpected errors during request processing
    console.error('Subscribe API route error:', err)
    let errorMessage = 'An unexpected error occurred.'
    if (err instanceof Error) {
      errorMessage = err.message
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
