import { Router, type IRouter } from "express";
import healthRouter from "./health";
import newsRouter from "./news";
import publicationsRouter from "./publications";
import legislationRouter from "./legislation";
import tendersRouter from "./tenders";
import faqsRouter from "./faqs";
import formsRouter from "./forms";
import servicesRouter from "./services";
import contactRouter from "./contact";
import searchRouter from "./search";
import statsRouter from "./stats";
import staffRouter from "./staff";
import pendingRouter from "./pending";  // ✅ Add this import

const router: IRouter = Router();

router.use(healthRouter);
router.use(newsRouter);
router.use(publicationsRouter);
router.use(legislationRouter);
router.use(tendersRouter);
router.use(faqsRouter);
router.use(formsRouter);
router.use(servicesRouter);
router.use(contactRouter);
router.use(searchRouter);
router.use(statsRouter);
router.use(staffRouter);
router.use(pendingRouter);  // ✅ Add this router

export default router;