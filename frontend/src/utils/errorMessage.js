const getErrorMessage = (
    error,
    fallback = "Something went wrong. Please try again."
) => {
    const responseData = error?.response?.data;

    const validationError = responseData?.errors?.[0];

    return (
        responseData?.message ||
        validationError?.msg ||
        validationError?.message ||
        error?.message ||
        fallback
    );
};

export default getErrorMessage;