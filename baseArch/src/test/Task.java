package test;

import com.lenovo.law.base.Constants;
import com.lenovo.law.thread.AbsWorkTask;

public class Task extends AbsWorkTask{


	@Override
	public Object call()  {
		this.getLogger().print(Constants.DEBUG, "Task ["+this.getId()+"] running" );
		try {
			Thread.sleep(20);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return this.getId();
	}

}
