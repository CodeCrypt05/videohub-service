// asyncHandler is a higher-order function that wraps async
// Express route handlers and forwards errors to the
// global error middleware, eliminating repetitive try/catch blocks.

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}
// this above is HighrOrder Function
// HigherOrder function take function as parameter

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await (req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             mesaage: error.mesaage
//         })
//     }
// }
