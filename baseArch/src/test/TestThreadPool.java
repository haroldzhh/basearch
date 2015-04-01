package test;

import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.LinkedBlockingQueue;

import com.lenovo.law.thread.AbsThreadPool;
import com.lenovo.law.base.Constants;

public class TestThreadPool extends AbsThreadPool {
	
	
	public static void main(String[] args) {
		TestThreadPool t = new TestThreadPool();
		t.getLogger().print(Constants.DEBUG, "Begin thread....");
		t.setPoolSize(10);
		t.setPoolMaxSize(10);
		t.setQueue(new LinkedBlockingQueue<Runnable>());
		try {
			t.init();
		} catch (Exception e) {
			t.getLogger().print(Constants.DEBUG, "init",e);
			return;
		}
		
		for(int i=0; i<50; i++){
			Task task = new Task();
			task.setId(i);
			try {
				t.execute(i, task);
			} catch (Exception e) {
				t.getLogger().print(Constants.DEBUG, "task exec error",e);
			}
		}
		
		
		t.shutdown();
		Iterator<Map.Entry<Integer,Future<?>>> iterator = t.getResut().entrySet().iterator();
		while(iterator.hasNext()) {
			Map.Entry<Integer,Future<?>> entry = (Map.Entry<Integer,Future<?>>) iterator.next();
			Integer key = entry.getKey(); 
			Future<?> result = t.getResut().get(key);
			try {
				t.getLogger().print(Constants.DEBUG, "Thread ["+key+"] result:"+result.get());
			} catch (InterruptedException e) {
				e.printStackTrace();
			} catch (ExecutionException e) {
				e.printStackTrace();
			}
		}
		
	}

}
