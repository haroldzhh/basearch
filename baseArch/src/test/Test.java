package test;

import com.lenovo.law.base.Constants;
import com.lenovo.law.log.AbsLogger;
import com.lenovo.law.log.LogBean;
import com.lenovo.law.log.LoggerAdapter;

public class Test extends AbsLogger{
	public final static LogBean logger = LoggerAdapter.getLogger(Test.class);
	public static void main(String[] args) {
		logger.print(Constants.INFO, "cccccccccccccccc");
//		Test2 t2 = new Test2();
//		Test2 t3 = new Test2();
//		Test t1 = new Test();
//		t2.(Constants.DEBUG, "ddddddd");
//		t3.logger.print(Constants.DEBUG, "eeeeeeeeeee");
//		t3.logger.print(Constants.DEBUG, "eeeeeeeeeee",new Exception("t3"));
		logger.print(Constants.DEBUG, "t1");
		logger.print(Constants.DEBUG, "t1",new Exception("pppppppppppppppp"));
		
		System.out.println("=======================================");
	}

}
