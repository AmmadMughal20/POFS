export interface ApiResponse
{
    success: boolean;
    message?: string;
    isAcceptingMessage?: boolean; // Optional, depending on the context
    data?: unknown; // Use 'any' for flexibility, or specify a more precise type if known
    error?: string; // Optional error message
    statusCode?: number; // Optional HTTP status code
}