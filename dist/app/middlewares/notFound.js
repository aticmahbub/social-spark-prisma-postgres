const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
};
export default notFound;
//# sourceMappingURL=notFound.js.map