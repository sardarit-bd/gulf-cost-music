export const handleApiError = (error, defaultMessage = "Something went wrong") => {
  if (error.response) {
    const data = error.response.data;

    if (data?.errors?.length > 0) {

      const fieldErrors = data.errors.map((err) => 
        `${err.param || err.field || "Field"}: ${err.msg || err.message}`
      );
      return fieldErrors.join("\n");
    }

    return data?.message || defaultMessage;
  }

  if (error.request) {
    return "No response from server. Please check your connection.";
  }

  return error.message || defaultMessage;
};
